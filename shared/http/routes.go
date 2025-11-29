package routes

import (
	cat "integrador/modulos/categoria/routes"
	credito "integrador/modulos/credito/routes"
	gastoFixo "integrador/modulos/fixo/routes"
	gasto "integrador/modulos/gasto/routes"
	pagamento "integrador/modulos/pagamento/routes"
	planejamento "integrador/modulos/planejamento/routes"
	user "integrador/modulos/user/routes"
	gastoVariado "integrador/modulos/variado/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func LoadRoutes(group *gin.RouterGroup, db *gorm.DB) {
	cat.CategoriaRouter(group, db)
	gasto.GastoRouter(group, db)
	gastoFixo.GastoFixoRouter(group, db)
	gastoVariado.GastoVariadoRouter(group, db)
	user.UserRoute(group, db)
	planejamento.PlanejamentoRouter(group, db)
	pagamento.PagamentoRouter(group, db)
	credito.CreditoRouter(group, db)

}
