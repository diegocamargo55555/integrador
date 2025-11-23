package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *CategoriaController) DeleteCategoria(c *gin.Context) {
	uuid := c.Param("ID")
	if err := h.categoriaService.DeleteCategoria(uuid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Categoria deletada!"})
}
