package room

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Routes(router *gin.Engine, db *gorm.DB) {
	controller := Controller{
		Db:   db,
	}
	r := router.Group("/api/rooms")
	r.POST("", controller.CreateRoom)
	r.GET("", controller.GetRoom)
	r.PUT("", controller.UpdateData)
	r.DELETE("", controller.DeleteRoom)
	r.GET("/refresh", controller.RefreshTempCode)
}
