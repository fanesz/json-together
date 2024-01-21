package room

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Routes(router *gin.Engine, db *gorm.DB) {
	controller := Controller{
		Db: db,
	}
	r := router.Group("/room")
	r.GET("/get", controller.GetRoom)
	r.POST("/create", controller.CreateRoom)
	r.POST("/update", controller.UpdateData)

}
