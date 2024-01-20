package handler

import (
	"github.com/gin-gonic/gin"
)

type ErrorResponseAPI struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func Error(c *gin.Context, status int, message string) {
	res := ErrorResponseAPI{
		StatusCode: status,
		Message:    message,
	}
	c.AbortWithStatusJSON(status, res)
}
