package ws

import (
	"backend/config/websocket"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Routes(router *gin.Engine, db *gorm.DB, pool *wsConfig.Pool) {
	controller := Controller{
		Pool: pool,
		Db:   db,
	}
	r := router.Group("/api/ws")

	r.GET("/create", controller.CreateWS)
	r.GET("/join", controller.ServeWS)
}
