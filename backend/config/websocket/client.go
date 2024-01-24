package wsConfig

import (
	"github.com/gorilla/websocket"
	"log"
	"sync"
)

type Client struct {
	ID       string
	Conn     *websocket.Conn
	Pool     *Pool
	RoomCode string `json:"room_code"`
	mu       sync.Mutex
}

type Message struct {
	RoomCode string `json:"room_code"`
	Activity string `json:"activity"`
	Body     string `json:"body"`
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
			RoomCode: c.RoomCode,
			Body:     string(clientMessage),
			Activity: "",
		}
		c.Pool.Broadcast <- message
		log.Printf("Message Received: %+v\n", message)
	}
}
