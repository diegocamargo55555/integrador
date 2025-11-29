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

func NewUserController(userService *user_services.UserService) *UserController {
	return &UserController{userService: *userService}
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

func (h *UserController) DeleteUserService(c *gin.Context) {
	uuid := c.Param("ID")
	if err := h.userService.DeleteUserService(uuid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "usuario deletado!"})
}

func (h *UserController) GetUser(c *gin.Context) {
	uuid := c.Param("ID")
	user, err := h.userService.GetByID(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario não encontrada!"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *UserController) UpdateUser(c *gin.Context) {
	id := c.Param("ID")
	user, err := h.userService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario não encontrada!"})
		return
	}
	var novousuario user_entities.Usuario = *user
	if err := c.ShouldBindJSON(&novousuario); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.userService.UpdateUser(&novousuario, user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novousuario)
}
