package router

import (
	controllers "integrador/modulos/pagamento/controllers"
	repositories "integrador/modulos/pagamento/repositories"
	services "integrador/modulos/pagamento/services"
	gastoRepositories "integrador/modulos/gasto/repositories"
	userRepositories "integrador/modulos/user/repositories"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupPagamentoRoutes(group *gin.RouterGroup, db *gorm.DB) {
	pagamentoRepository := repositories.NewPagamentoRepository(db)
	gastoRepository := gastoRepositories.NewGastoRepository(db)
	userRepository := userRepositories.NewUserRepository(db)
	pagamentoService := services.NewPagamentoService(pagamentoRepository, gastoRepository, userRepository)
	pagamentoController := controllers.NewPagamentoController(pagamentoService)

	group.GET("/pagamento", pagamentoController.ListPagamentos)
	group.GET("/pagamento/:ID", pagamentoController.GetPagamento)
	group.POST("/pagamento", pagamentoController.CreatePagamento)
	group.PUT("/pagamento/:ID", pagamentoController.UpdatePagamento)
	group.DELETE("/pagamento/:ID", pagamentoController.DeletePagamento)
}
