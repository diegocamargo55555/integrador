package router

import (
	controllers "integrador/modulos/planejamento/controllers"
	repositories "integrador/modulos/planejamento/repositories"
	services "integrador/modulos/planejamento/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PlanejamentoRouter(group *gin.RouterGroup, db *gorm.DB) {
	planejamentoRepository := repositories.NewPlanejamentoRepository(db)
	planejamentoService := services.NewPlanejamentoService(planejamentoRepository)
	planejamentoController := controllers.NewPlanejamentoController(planejamentoService)
	group.GET("/planejamento/user:ID", planejamentoController.ListUserCategorias)

	group.GET("/planejamento", planejamentoController.ListPlanejamentos)
	group.GET("/planejamento/:ID", planejamentoController.GetPlanejamento)
	group.POST("/planejamento", planejamentoController.CreatePlanejamento)
	group.PUT("/planejamento/:ID", planejamentoController.UpdatePlanejamento)
	group.DELETE("/planejamento/:ID", planejamentoController.DeletePlanejamento)
}
