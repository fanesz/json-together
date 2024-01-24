package wsConfig

import (
	"fmt"
	"log"
	"sync"
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

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Mutex.Lock()
			pool.Clients[client] = true
			if _, ok := pool.Rooms[client.RoomID]; !ok {
				pool.Rooms[client.RoomID] = make(map[*Client]bool)
			}
			pool.Rooms[client.RoomID][client] = true
			pool.Mutex.Unlock()

			fmt.Println("size of connection pool:", len(pool.Clients))
			for c := range pool.Rooms[client.RoomID] {
				c.Conn.WriteJSON(Message{Activity: "New user joined..."})
			}
			if history, ok := pool.MessageHistory[client.RoomID]; ok {
				if len(history) > 0 {
					lastMsg := history[len(history)-1]
					client.Conn.WriteJSON(lastMsg)
				}
			}

		case client := <-pool.Unregister:
			pool.Mutex.Lock()
			delete(pool.Clients, client)
			delete(pool.Rooms[client.RoomID], client)
			pool.Mutex.Unlock()

			fmt.Println("size of connection pool:", len(pool.Clients))
			for c := range pool.Rooms[client.RoomID] {
				c.Conn.WriteJSON(Message{Activity: "User disconnected..."})
			}

		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in the room")

			pool.Mutex.Lock()
			roomClients, roomExists := pool.Rooms[message.RoomID]
			pool.Mutex.Unlock()

			if roomExists {
				for client := range roomClients {
					if err := client.Conn.WriteJSON(message); err != nil {
						log.Println(err)
						return
					}
				}
				pool.MessageHistory[message.RoomID] = append(pool.MessageHistory[message.RoomID], message)
			}

		}
	}
}
