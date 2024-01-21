package ws

import (
	"backend/config/websocket"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine, pool *wsConfig.Pool) {
	r := router.Group("/ws")

	r.GET("/join", pool.ServeWS)
}
