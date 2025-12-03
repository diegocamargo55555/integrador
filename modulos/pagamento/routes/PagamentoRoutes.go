package router

import (
	gastoRepository "integrador/modulos/gasto/repositories"
	controllers "integrador/modulos/pagamento/controllers"
	repositories "integrador/modulos/pagamento/repositories"
	"integrador/modulos/pagamento/services"
	userRepository "integrador/modulos/user/repositories"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PagamentoRouter(group *gin.RouterGroup, db *gorm.DB) {
	pagamentoRepository := repositories.NewPagamentoRepository(db)
	userRepository := userRepository.NewUserRepository(db)
	gastoRepository := gastoRepository.NewGastoRepository(db)
	pagamentoService := services.NewPagamentoService(pagamentoRepository, userRepository, gastoRepository)
	pagamentoController := controllers.NewPagamentoController(pagamentoService)

	group.GET("/pagamento", pagamentoController.ListPagamentos)
	group.GET("/pagamento/:ID", pagamentoController.GetPagamento)
	group.POST("/pagamento", pagamentoController.CreatePagamento)
	group.PUT("/pagamento/:ID", pagamentoController.UpdatePagamento)
	group.DELETE("/pagamento/:ID", pagamentoController.DeletePagamento)
}
