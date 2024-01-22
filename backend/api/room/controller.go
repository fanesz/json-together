package room

import (
	wsConfig "backend/config/websocket"
	"backend/handler"
	"backend/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Db   *gorm.DB
	Pool *wsConfig.Pool
}

func (a *Controller) CreateRoom(c *gin.Context) {
	// body { user_id }
	room := Room{}
	if err := handler.BindAndStructValidator(c, &room, true); err != nil {
		return
	}

	room.RoomID = utils.RandomString(20)

	for {
		room.RoomID = utils.RandomString(20)
		if !isCodeExist("room_id", room.RoomID, a.Db) {
			break
		}
	}

	fmt.Println(room.RoomID)

	queryCreate := a.Db.Create(&room)
	val, _ := handler.QueryValidator(queryCreate, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success creating a room", gin.H{"room_id": room.RoomID})
}

func (a *Controller) GetRoom(c *gin.Context) {
	// param { room_id }
	roomID := c.Query("room_id")
	if roomID == "" {
		handler.Error(c, http.StatusBadRequest, "Room ID is required")
		return
	}

	room := Room{}
	query := a.Db.Where("room_id = ?", roomID).First(&room)
	val, _ := handler.QueryValidator(query, c, false)
	if !val {
		return
	}

	if room.TempRoomID == "" {
		for {
			room.TempRoomID = utils.RandomString(5)
			if !isCodeExist("temp_room_id", room.TempRoomID, a.Db) {
				break
			}
		}
		queryUpdate := a.Db.Where("room_id = ?", roomID).Updates(&room)
		val, _ := handler.QueryValidator(queryUpdate, c, false)
		if !val {
			return
		}
	}

	handler.Success(c, http.StatusOK, "Success getting the room", gin.H{"data": room})
}

func (a *Controller) UpdateData(c *gin.Context) {
	// param { room_id } body { data }
	room := Room{}
	if err := handler.BindAndStructValidator(c, &room, true); err != nil {
		return
	}

	room.RoomID = c.Query("room_id")
	if room.RoomID == "" {
		handler.Error(c, http.StatusBadRequest, "Room ID is required")
		return
	}

	query := a.Db.Where("room_id = ?", room.RoomID).Updates(&room)
	val, _ := handler.QueryValidator(query, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success updating the data", gin.H{"data": room})
}

func (a *Controller) DeleteRoom(c *gin.Context) {
	// param { room_id }
	roomID := c.Query("room_id")
	if roomID == "" {
		handler.Error(c, http.StatusBadRequest, "Room ID is required")
		return
	}

	room := Room{}
	query := a.Db.Where("room_id = ?", roomID).Delete(&room)
	val, _ := handler.QueryValidator(query, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success deleting the room", nil)
}

func (a *Controller) RefreshTempCode(c *gin.Context) {
	// param { room_id }
	roomID := c.Query("room_id")
	if roomID == "" {
		handler.Error(c, http.StatusBadRequest, "Room ID is required")
		return
	}

	room := Room{}
	query := a.Db.Where("room_id = ?", roomID).First(&room)
	val, _ := handler.QueryValidator(query, c, false)
	if !val {
		return
	}

	for {
		room.TempRoomID = utils.RandomString(5)
		if !isCodeExist("temp_room_id", room.TempRoomID, a.Db) {
			break
		}
	}

	queryUpdate := a.Db.Where("room_id = ?", roomID).Updates(&room)
	val, _ = handler.QueryValidator(queryUpdate, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusOK, "Success refreshing the temp code", gin.H{"temp_room_id": room.TempRoomID})
}

func isCodeExist(field string, code string, db *gorm.DB) bool {
	var isExist bool
	query := db.Model(Room{}).Select("count(*) > 0").Where(field+" = ?", code).Find(&isExist)
	val, _ := handler.QueryValidator(query, nil, false)
	if !val {
		fmt.Println("Error checking code")
		return false
	}
	return isExist
}
