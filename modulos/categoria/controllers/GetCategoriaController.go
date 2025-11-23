package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *CategoriaController) GetCategoria(c *gin.Context) {
	uuid := c.Param("ID")
	categoria, err := h.categoriaService.GetCategoriaById(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categoria não encontrada!"})
		return
	}
	c.JSON(http.StatusOK, categoria)
}
