package router

import (
	controllers "integrador/modulos/categoria/controllers"
	repositories "integrador/modulos/categoria/repositories"
	services "integrador/modulos/categoria/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CategoriaRouter(group *gin.RouterGroup, db *gorm.DB) {
	categoriaRepository := repositories.NewCategoryRepository(db)
	categoriaService := services.NewCategoriaService(categoriaRepository)
	categoriaController := controllers.NewCategoriaController(categoriaService)

	group.GET("/categoria/user/:ID", categoriaController.ListUserCategorias)
	group.GET("/categoria", categoriaController.ListUserCategorias)
	group.GET("/categoria/get/:ID", categoriaController.GetCategoria)
	group.POST("/categoria", categoriaController.CreateCategoria)
	group.PUT("/categoria/:ID", categoriaController.UpdateCategoria)
	group.DELETE("/categoria/:ID", categoriaController.DeleteCategoria)
}
