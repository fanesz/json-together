package main

import (
	"backend/api/room"
	"backend/api/user"
	"backend/api/websocket"
	"backend/config/database"
	wsConfig "backend/config/websocket"

	// "backend/config/websocket"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db := config.InitDB()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
		MaxAge: 12 * time.Hour,
	}))

	pool := wsConfig.NewPool()
	go pool.Start()

	room.Routes(router, db)
	user.Routes(router, db)
	ws.Routes(router, pool)

	router.Run("localhost:5000")
}
