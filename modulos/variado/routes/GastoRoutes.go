package router

import (
	repositoriesGasto "integrador/modulos/gasto/repositories"
	controllers "integrador/modulos/variado/controllers"
	repositories "integrador/modulos/variado/repositories"
	services "integrador/modulos/variado/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GastoVariadoRouter(group *gin.RouterGroup, db *gorm.DB) {
	gastoVariadoRepository := repositories.NewGastoVariadoRepository(db)
	gastoRepository := repositoriesGasto.NewGastoRepository(db)
	gastoVariadoService := services.NewGastoVariadoService(gastoVariadoRepository, gastoRepository)
	gastoVariadoController := controllers.NewGastoVariadoController(gastoVariadoService)

	group.GET("/gasto/variado", gastoVariadoController.ListGastosVariado)
	group.GET("/gasto/variado/:ID", gastoVariadoController.GetGastoVariado)
	group.POST("/gasto/variado", gastoVariadoController.CreateGastoVariado)
	group.PUT("/gasto/variado/:ID", gastoVariadoController.UpdateGasto)
}
