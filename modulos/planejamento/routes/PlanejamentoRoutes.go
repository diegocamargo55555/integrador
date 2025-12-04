package router

import (
	controllers "integrador/modulos/planejamento/controllers"
	repositories "integrador/modulos/planejamento/repositories"
	services "integrador/modulos/planejamento/services"

	gastoRepo "integrador/modulos/gasto/repositories"
	gastoServices "integrador/modulos/gasto/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PlanejamentoRouter(group *gin.RouterGroup, db *gorm.DB) {
	planejamentoRepository := repositories.NewPlanejamentoRepository(db)
	planejamentoService := services.NewPlanejamentoService(planejamentoRepository)

	gastoRepository := gastoRepo.NewGastoRepository(db)
	gastoService := gastoServices.NewGastoService(gastoRepository, planejamentoRepository)

	planejamentoController := controllers.NewPlanejamentoController(planejamentoService, gastoService)
	group.GET("/planejamento/user/:ID", planejamentoController.ListUserPlanejamentos)

	group.GET("/planejamento", planejamentoController.ListPlanejamentos)
	group.GET("/planejamento/:ID", planejamentoController.GetPlanejamento)
	group.POST("/planejamento", planejamentoController.CreatePlanejamento)
	group.PUT("/planejamento/:ID", planejamentoController.UpdatePlanejamento)
	group.DELETE("/planejamento/:ID", planejamentoController.DeletePlanejamento)
	group.POST("/planejamento/:ID/depositar", planejamentoController.DepositarPlanejamento)
}
