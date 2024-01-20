package room

import (
	"backend/handler"
	"backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Db *gorm.DB
}

func (a *Controller) CreateRoom(c *gin.Context) {
	// body { user_id }
	room := Room{}
	if err := handler.BindAndStructValidator(c, &room, true); err != nil {
		return
	}

	fmt.Println(room)

	room.RoomID = utils.RandomString(20)

	queryCreate := a.Db.Create(&room)
	val, _ := handler.QueryValidator(queryCreate, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success creating a room", gin.H{"room_id": room.RoomID})
}

func (a *Controller) GetData(c *gin.Context) {
	// body { room_id }
	room := Room{}
	if err := handler.BindAndStructValidator(c, &room, true); err != nil {
		return
	}

	query := a.Db.Where("room_id = ?", room.RoomID).First(&room)
	val, _ := handler.QueryValidator(query, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success getting the data", gin.H{"data": room})
}

func (a *Controller) UpdateData(c *gin.Context) {
	// body { room_id, data }
	room := Room{}
	if err := handler.BindAndStructValidator(c, &room, true); err != nil {
		return
	}

	query := a.Db.Where("room_id = ?", room.RoomID).Updates(&room)
	val, _ := handler.QueryValidator(query, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success updating the data", gin.H{"data": room})
}
