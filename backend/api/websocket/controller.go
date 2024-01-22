package ws

import (
	wsConfig "backend/config/websocket"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type Controller struct {
	Db   *gorm.DB
	Pool *wsConfig.Pool
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

func (a *Controller) ServeWS(c *gin.Context) {
	roomID := c.Query("room_id")
	action := c.Query("action")

	conn, err := wsConfig.Upgrade(c)
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

	a.Pool.Mutex.Lock()
	_, roomExists := a.Pool.Rooms[roomID]
	roomClients := len(a.Pool.Rooms[roomID])
	a.Pool.Mutex.Unlock()

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

	client := &wsConfig.Client{
		Conn:   conn,
		Pool:   a.Pool,
		RoomID: roomID,
	}
	a.Pool.Register <- client
	client.Read()
}
