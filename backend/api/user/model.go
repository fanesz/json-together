package user

import (
	"time"
)

type User struct {
	UserID    string `gorm:"primaryKey;autoIncrement" json:"user_id"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
