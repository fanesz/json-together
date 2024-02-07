package wsConfig

import (
	"backend/api/room"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
	"log"
	"sync"
	"time"
)

type Pool struct {
	Register       chan *Client
	Unregister     chan *Client
	Clients        map[*Client]bool
	Rooms          map[string]map[*Client]bool
	Broadcast      chan Message
	MessageHistory map[string][]Message
	Mutex          sync.Mutex
}

func NewPool() *Pool {
	return &Pool{
		Register:       make(chan *Client),
		Unregister:     make(chan *Client),
		Clients:        make(map[*Client]bool),
		Rooms:          make(map[string]map[*Client]bool),
		Broadcast:      make(chan Message),
		MessageHistory: make(map[string][]Message),
	}
}

func (pool *Pool) Start(db *gorm.DB) {
	for {
		select {
		case client := <-pool.Register:
			pool.Mutex.Lock()
			if _, ok := pool.Rooms[client.RoomCode]; !ok {
				client.Conn.WriteControl(
					websocket.CloseMessage,
					[]byte("Room not found"),
					time.Now().Add(time.Second),
				)
			}
			pool.Clients[client] = true
			pool.Rooms[client.RoomCode][client] = true
			pool.Mutex.Unlock()

			for c := range pool.Rooms[client.RoomCode] {
				c.Conn.WriteJSON(Message{Activity: "New user joined..."})
			}
			if history, ok := pool.MessageHistory[client.RoomCode]; ok {
				if len(history) > 0 {
					lastMsg := history[len(history)-1]
					client.Conn.WriteJSON(lastMsg)
				}
			}

		case client := <-pool.Unregister:
			pool.Mutex.Lock()
			delete(pool.Clients, client)
			delete(pool.Rooms[client.RoomCode], client)
			pool.Mutex.Unlock()

			go func() {
				time.Sleep(1 * time.Minute)
				pool.Mutex.Lock()
				clientInsideRoom := len(pool.Rooms[client.RoomCode])
				pool.Mutex.Unlock()
				if clientInsideRoom == 0 {
					delete(pool.Rooms, client.RoomCode)
					db.Model(&room.Room{}).Where("temp_room_id = ?", client.RoomCode).Update("temp_room_id", "")
				}
			}()

			for c := range pool.Rooms[client.RoomCode] {
				c.Conn.WriteJSON(Message{Activity: "User disconnected..."})
			}

		case message := <-pool.Broadcast:
			pool.Mutex.Lock()
			roomClients, roomExists := pool.Rooms[message.RoomCode]
			pool.Mutex.Unlock()

			if roomExists {
				for client := range roomClients {
					if err := client.Conn.WriteJSON(message); err != nil {
						log.Println(err)
						return
					}
				}
				pool.MessageHistory[message.RoomCode] = append(pool.MessageHistory[message.RoomCode], message)
			}

		}
	}
}
