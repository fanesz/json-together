package room

import (
	"backend/handler"
	"backend/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type Controller struct {
	Db *gorm.DB
}

func (a *Controller) GetRoom(c *gin.Context) {
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

	handler.Success(c, http.StatusOK, "Success getting the room", gin.H{"data": room})
}

func (a *Controller) CreateRoom(c *gin.Context) {
	// body { user_id }
	room := Room{}
	if err := handler.BindAndStructValidator(c, &room, true); err != nil {
		return
	}

	room.RoomID = utils.RandomString(5)

	queryCreate := a.Db.Create(&room)
	val, _ := handler.QueryValidator(queryCreate, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success creating a room", gin.H{"room_id": room.RoomID})
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
