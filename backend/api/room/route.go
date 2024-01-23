package room

import (
	wsConfig "backend/config/websocket"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Routes(router *gin.Engine, db *gorm.DB, pool *wsConfig.Pool) {
	controller := Controller{
		Db:   db,
		Pool: pool,
	}
	r := router.Group("/api/rooms")
	r.POST("", controller.CreateRoom)
	r.GET("", controller.GetRoom)
	r.PUT("", controller.UpdateData)
	r.DELETE("", controller.DeleteRoom)
	r.GET("/refresh", controller.RefreshTempCode)
}
