package main

import (
	"backend/api/room"
	"backend/api/user"
	"backend/api/websocket"
	"backend/config/database"
	"backend/config/websocket"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func main() {
	db := DBConfig.InitDB()
	pool := wsConfig.NewPool()
	router := gin.Default()
	go pool.Start()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
		MaxAge: 12 * time.Hour,
	}))

	room.Routes(router, db, pool)
	user.Routes(router, db)
	ws.Routes(router, pool)

	router.Run("localhost:5000")
}
