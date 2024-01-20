package user

import (
	"backend/handler"
	"backend/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type Controller struct {
	Db *gorm.DB
}

func (a *Controller) CreateUser(c *gin.Context) {
	user := User{}
	user.UserID = utils.RandomString(20)

	queryCreate := a.Db.Create(&user)
	val, _ := handler.QueryValidator(queryCreate, c, false)
	if !val {
		return
	}

	handler.Success(c, http.StatusCreated, "Success creating an user", gin.H{"user_id": user.UserID})
}
