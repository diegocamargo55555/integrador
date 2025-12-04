package user_controllers

import (
	user_entities "integrador/modulos/user/entities"
	user_services "integrador/modulos/user/services"
	"integrador/shared/auth"
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

type LoginRequest struct {
	Email string `json:"email" binding:"required,email"`
	Senha string `json:"senha" binding:"required"`
}

type UpdateUserRequest struct {
	Nome       string `json:"name"`
	Email      string `json:"email"`
	Senha      string `json:"senha"`       
	SenhaAtual string `json:"senha_atual"` 
}

func (h *UserController) Login(c *gin.Context) {
	var credentials LoginRequest

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	response, err := h.userService.LoginService(credentials.Email, credentials.Senha)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

func GetUserProfile(c *gin.Context) {
	user, _ := c.Get("currentUser")
	c.JSON(200, gin.H{
		"user": user,
	})
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario não encontrado!"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *UserController) UpdateUser(c *gin.Context) {
	id := c.Param("ID")
	
	usuarioAtual, err := h.userService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado!"})
		return
	}

	var input UpdateUserRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Nome != "" {
		usuarioAtual.Nome = input.Nome
	}
	if input.Email != "" {
		usuarioAtual.Email = input.Email
	}

	if input.Senha != "" {
		if input.SenhaAtual == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Para alterar a senha, é necessário informar a senha atual."})
			return
		}

		if !auth.CheckPasswordHash(input.SenhaAtual, usuarioAtual.Senha) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "A senha atual está incorreta."})
			return
		}
		novoHash, err := auth.HashPassword(input.Senha)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar nova senha."})
			return
		}

		usuarioAtual.Senha = novoHash
	}

	usuarioAtual.UpdatedAt = time.Now()

	if err := h.userService.UpdateUser(usuarioAtual, usuarioAtual); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, usuarioAtual)
}