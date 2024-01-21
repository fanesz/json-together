package wsConfig

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
	"log"
	"time"
)

type Controller struct {
	Db *gorm.DB
}

func handleCloseConnection(conn *websocket.Conn, reason string) {
	err := conn.WriteControl(
		websocket.CloseMessage,
		[]byte("  "+reason),
		time.Now().Add(time.Second),
	)
	if err != nil {
		log.Println("Error rejecting connection:", err)
	}
}

func (pool *Pool) ServeWS(c *gin.Context) {
	roomID := c.Query("room_id")
	action := c.Query("action")

	conn, err := Upgrade(c)
	if err != nil {
		fmt.Fprintf(c.Writer, "%+v\n", err)
		return
	}

	if action != "create" && action != "join" {
		handleCloseConnection(conn, "Invalid action parameter")
		return
	}

	if len(roomID) != 5 {
		handleCloseConnection(conn, "room_id parameter is required")
		return
	}

	pool.Mutex.Lock()
	_, roomExists := pool.Rooms[roomID]
	roomClients := len(pool.Rooms[roomID])
	pool.Mutex.Unlock()

	fmt.Println(action, roomID, roomExists, roomClients)

	if action == "create" && roomExists && roomClients != 0 {
		handleCloseConnection(conn, "The specified room already exists. Please choose a different room ID.")
		return
	} else if action == "join" && !roomExists {
		handleCloseConnection(conn, "The specified room does not exist.")
		return
	} else if action == "join" && roomClients == 0 {
		handleCloseConnection(conn, "The specified room already closed. Please choose a different room ID.")
		return
	}

	client := &Client{
		Conn:   conn,
		Pool:   pool,
		RoomID: roomID,
	}
	pool.Register <- client
	client.Read()
}
