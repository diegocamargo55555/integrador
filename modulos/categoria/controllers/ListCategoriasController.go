package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *CategoriaController) ListBooks(c *gin.Context) {
	categorias, err := h.categoriaService.GetAllCategorias()
	// categorias, err := services.CategoriaService.GetAllBooks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categorias)
}
