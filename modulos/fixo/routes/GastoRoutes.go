package router

import (
	controllers "integrador/modulos/fixo/controllers"
	repositories "integrador/modulos/fixo/repositories"
	services "integrador/modulos/fixo/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GastoFixoRouter(group *gin.RouterGroup, db *gorm.DB) {
	gastoFixoRepository := repositories.NewGastoFixoRepository(db)
	gastoFixoService := services.NewGastoFixoService(gastoFixoRepository)
	gastoFixoController := controllers.NewGastoFixoController(gastoFixoService)

	group.GET("/gasto/fixo", gastoFixoController.ListGastosFixo)
	group.GET("/gasto/fixo/:ID", gastoFixoController.GetGastoFixo)
	group.POST("/gasto/fixo", gastoFixoController.CreateGastoFixo)
	group.PUT("/gasto/fixo/:ID", gastoFixoController.UpdateGasto)
}
