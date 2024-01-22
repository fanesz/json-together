package user

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Routes(router *gin.Engine, db *gorm.DB) {
	controller := Controller{
		Db: db,
	}
	r := router.Group("/api/user")
	r.GET("/create", controller.CreateUser)
}
