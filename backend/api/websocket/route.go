package ws

import (
	"backend/config/websocket"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine, pool *wsConfig.Pool) {
	controller := Controller{
		Pool: pool,
	}
	r := router.Group("/ws")

	r.GET("/join", controller.ServeWS)
}
