package wsConfig

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Controller struct {
	Db *gorm.DB
}

func (pool *Pool) ServeWS(c *gin.Context) {
	fmt.Println("WebSocket Endpoint Hit")

	conn, err := Upgrade(c)

	if err != nil {
		fmt.Fprintf(c.Writer, "%+v\n", err)
	}
	client := &Client{
		Conn: conn,
		Pool: pool,
	}
	pool.Register <- client
	client.Read()
}
