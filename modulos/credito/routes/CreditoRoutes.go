package router

import (
	controllers "integrador/modulos/credito/controllers"
	repositories "integrador/modulos/credito/repositories"
	services "integrador/modulos/credito/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreditoRouter(group *gin.RouterGroup, db *gorm.DB) {
	creditoRepository := repositories.NewCreditoRepository(db)
	creditoService := services.NewCreditoService(creditoRepository)
	creditoController := controllers.NewCreditoController(creditoService)

	group.GET("/pagamento/credito", creditoController.ListCredito)
	group.GET("/pagamento/credito/:ID", creditoController.GetCredito)
	group.POST("/pagamento/credito", creditoController.CreateCredito)
	group.PUT("/pagamento/credito/:ID", creditoController.UpdateCredito)
}
