package controllers

import (
	"net/http"
	"time"

	Entidades "integrador/modulos/categoria/entities"

	"github.com/gin-gonic/gin"
)

func (h *CategoriaController) CreateCategoria(c *gin.Context) {
	var categoria Entidades.Categoria

	if err := c.ShouldBindJSON(&categoria); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	categoria.CreatedAt = time.Now()
	categoria.UpdatedAt = time.Now()
	if err := h.categoriaService.CreateCategoriaService(&categoria); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, categoria)
}
