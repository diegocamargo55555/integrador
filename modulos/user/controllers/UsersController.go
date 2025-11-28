package user_controllers

import (
	user_entities "integrador/modulos/user/entities"
	user_services "integrador/modulos/user/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService user_services.UserService
}

func (h *UserController) CreateUser(c *gin.Context) {
	var user user_entities.Usuario

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	if err := h.userService.CreateUserService(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func (h *UserController) ListUsers(c *gin.Context) {
	users, err := h.userService.ListUserService()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}
