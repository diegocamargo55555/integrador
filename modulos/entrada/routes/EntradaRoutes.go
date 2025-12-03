package entrada_routes

import (
	entrada_controllers "integrador/modulos/entrada/controllers"
	"integrador/modulos/entrada/repositories"
	entrada_services "integrador/modulos/entrada/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func EntradaRouter(group *gin.RouterGroup, db *gorm.DB) {
	entradaRepository := repositories.NewEntradaRepository(db)
	entradaService := entrada_services.NewEntradaService(entradaRepository)
	entradaController := entrada_controllers.NewEntradaController(entradaService)

	group.GET("/entrada", entradaController.ListEntrada)
	group.GET("/entrada/:ID", entradaController.GetEntrada)
	group.POST("/entrada", entradaController.CreateEntrada)
	group.PUT("/entrada/:ID", entradaController.UpdateEntrada)
	group.DELETE("/entrada/:ID", entradaController.DeleteEntradaService)
}
