package ws

import (
	"backend/api/room"
	wsConfig "backend/config/websocket"
	"backend/handler"
	"fmt"
	"log"
	"net/http"
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

func (a *Controller) CreateWS(c *gin.Context) {
	roomCode := c.Query("room_code")

	if len(roomCode) != 5 {
		handler.Error(c, http.StatusBadRequest, "Invalid action parameter")
		return
	}

	var isExist bool
	query := a.Db.Model(&room.Room{}).Select("count(*) > 0").Where("temp_room_id = ?", roomCode).Find(&isExist)
	val, _ := handler.QueryValidator(query, c, false)
	if !val {
		return
	}
	if !isExist {
		handler.Error(c, http.StatusNotFound, "Room not found")
		return
	}

	a.Pool.Mutex.Lock()
	_, isExist = a.Pool.Rooms[roomCode]

	if isExist {
		handler.Error(c, http.StatusConflict, "The specified room already exists.")
		a.Pool.Mutex.Unlock()
		return
	} else {
		a.Pool.Rooms[roomCode] = make(map[*wsConfig.Client]bool)
		a.Pool.Mutex.Unlock()
	}
	handler.Success(c, http.StatusOK, "Room created successfully", gin.H{})
}

func (a *Controller) ServeWS(c *gin.Context) {
	roomCode := c.Query("room_code")

	conn, err := wsConfig.Upgrade(c)
	if err != nil {
		fmt.Fprintf(c.Writer, "%+v\n", err)
		return
	}

	if len(roomCode) != 5 {
		handleCloseConnection(conn, "Invalid parameter")
		return
	}

	a.Pool.Mutex.Lock()
	_, roomExists := a.Pool.Rooms[roomCode]
	a.Pool.Mutex.Unlock()

	if !roomExists {
		handleCloseConnection(conn, "The specified room does not exist.")
		return
	}

	client := &wsConfig.Client{
		Conn:     conn,
		Pool:     a.Pool,
		RoomCode: roomCode,
	}
	a.Pool.Register <- client
	client.Read()
}
