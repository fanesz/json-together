package wsConfig

import (
	"github.com/gorilla/websocket"
	"log"
	"sync"
)

type Client struct {
	ID     string
	Conn   *websocket.Conn
	Pool   *Pool
	RoomID string `json:"room_id"`
	mu     sync.Mutex
}

type Message struct {
	RoomID string `json:"room_id"`
	Body   string `json:"body"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()
	for {
		_, clientMessage, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		message := Message{
			RoomID: c.RoomID,
			Body:   string(clientMessage),
		}
		c.Pool.Broadcast <- message
		log.Printf("Message Received: %+v\n", message)
	}
}
