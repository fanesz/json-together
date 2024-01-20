package config

import (
	"backend/api/room"
	"backend/api/user"
	"gorm.io/gorm"
)

type MigratableModel interface {
	Migrate(db *gorm.DB) error
}

var listModels = []interface{}{
	&user.User{},
	&room.Room{},
}

func Migrate(db *gorm.DB) error {
	for _, model := range listModels {
		if err := db.AutoMigrate(model); err != nil {
			return err
		}
	}
	return nil
}
