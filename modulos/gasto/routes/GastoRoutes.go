package router

import (
	controllers "integrador/modulos/gasto/controllers"
	repositories "integrador/modulos/gasto/repositories"
	services "integrador/modulos/gasto/services"
	planRepo "integrador/modulos/planejamento/repositories"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GastoRouter(group *gin.RouterGroup, db *gorm.DB) {
	gastoRepository := repositories.NewGastoRepository(db)
	planRepository := planRepo.NewPlanejamentoRepository(db)
	gastoService := services.NewGastoService(gastoRepository, planRepository)
	gastoController := controllers.NewGastoController(gastoService)

	group.GET("/gasto", gastoController.ListGastos)
	group.GET("/gasto/:ID", gastoController.GetGasto)
	group.POST("/gasto", gastoController.CreateGasto)
	group.PUT("/gasto/:ID", gastoController.UpdateGasto)
	group.DELETE("/gasto/:ID", gastoController.DeleteGasto)
}
