package router

import (
	controllers "integrador/modulos/pagamento/controllers"
	repositories "integrador/modulos/pagamento/repositories"
	services "integrador/modulos/pagamento/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PagamentoRouter(group *gin.RouterGroup, db *gorm.DB) {
	pagamentoRepository := repositories.NewPagamentoRepository(db)
	pagamentoService := services.NewPagamentoService(pagamentoRepository)
	pagamentoController := controllers.NewPagamentoController(pagamentoService)

	group.GET("/pagamento", pagamentoController.ListPagamentos)
	group.GET("/pagamento/:ID", pagamentoController.GetPagamento)
	group.POST("/pagamento", pagamentoController.CreatePagamento)
	group.PUT("/pagamento/:ID", pagamentoController.UpdatePagamento)
	group.DELETE("/pagamento/:ID", pagamentoController.DeletePagamento)
}
