package user_routes

import (
	categoria "integrador/modulos/categoria/repositories"
	user_controllers "integrador/modulos/user/controllers"
	"integrador/modulos/user/repositories"
	user_services "integrador/modulos/user/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserRoute(group *gin.RouterGroup, db *gorm.DB) {
	userRepository := repositories.NewUserRepository(db)
	catRepository := categoria.NewCategoryRepository(db)
	userService := user_services.NewUserService(userRepository, catRepository)
	userController := user_controllers.NewUserController(userService)

	group.POST("/login", userController.Login)

	group.GET("/user", userController.ListUsers)
	group.GET("/user/:ID", userController.GetUser)
	group.POST("/user", userController.CreateUser)
	group.PUT("/user/:ID", userController.UpdateUser)
	group.DELETE("/user/:ID", userController.DeleteUserService)
}
