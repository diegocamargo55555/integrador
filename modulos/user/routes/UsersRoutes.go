package user_routes

import (
	user_controllers "integrador/modulos/user/controllers"
	"integrador/modulos/user/repositories"
	user_services "integrador/modulos/user/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserRoute(group *gin.RouterGroup, db *gorm.DB) {
	userRepository := repositories.NewCategoryRepository(db)
	userService := user_services.NewUserService(userRepository)
	userController := user_controllers.NewUserController(userService)

	group.GET("/user", userController.ListUsers)
	group.POST("/user", userController.CreateUser)
}
