package ws

import (
	"backend/config/websocket"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine, pool *wsConfig.Pool) {
	controller := Controller{
		Pool: pool,
	}
	r := router.Group("/api/ws")

	r.GET("/create", controller.CreateWS)
	r.GET("/join", controller.ServeWS)
}
