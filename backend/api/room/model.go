package room

import (
	"backend/api/user"
	"time"
)

type Room struct {
	RoomID    string    `gorm:"primaryKey;autoIncrement" json:"room_id"`
	UserID    string    `gorm:"not null" json:"user_id"`
	User      user.User `gorm:"foreignKey:user_id;references:user_id"`
	Data      string    `gorm:"not null" json:"data"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
