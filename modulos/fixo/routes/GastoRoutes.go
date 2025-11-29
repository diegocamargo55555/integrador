package router

import (
	controllers "integrador/modulos/fixo/controllers"
	repositoriesFixo "integrador/modulos/fixo/repositories"
	services "integrador/modulos/fixo/services"
	repositoriesGasto "integrador/modulos/gasto/repositories"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GastoFixoRouter(group *gin.RouterGroup, db *gorm.DB) {
	gastoFixoRepository := repositoriesFixo.NewGastoFixoRepository(db)
	gastoRepository := repositoriesGasto.NewGastoRepository(db)
	gastoFixoService := services.NewGastoFixoService(gastoFixoRepository, gastoRepository)
	gastoFixoController := controllers.NewGastoFixoController(gastoFixoService)

	group.GET("/gasto/fixo", gastoFixoController.ListGastosFixo)
	group.GET("/gasto/fixo/:ID", gastoFixoController.GetGastoFixo)
	group.POST("/gasto/fixo", gastoFixoController.CreateGastoFixo)
	group.PUT("/gasto/fixo/:ID", gastoFixoController.UpdateGasto)
}
