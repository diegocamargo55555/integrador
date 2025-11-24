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
	resultado, err := h.categoriaService.GetCategoriaByName(categoria.Nome)

	if resultado.Nome == categoria.Nome || err == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Já existe uma categoria com esse nome!"})
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
