package routes

import (
	cat "integrador/modulos/categoria/routes"
	gasto "integrador/modulos/gasto/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func LoadRoutes(group *gin.RouterGroup, db *gorm.DB) {
	cat.CategoriaRouter(group, db)
	gasto.GastoRouter(group, db)

}
