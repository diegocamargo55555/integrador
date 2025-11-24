package controllers

import (
	Entidades "integrador/modulos/categoria/entities"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *CategoriaController) UpdateCategoria(c *gin.Context) {
	id := c.Param("ID")
	categoria, err := h.categoriaService.GetCategoriaById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categoria não encontrada!"})
		return
	}
	var novaCategoria Entidades.Categoria = *categoria
	if err := c.ShouldBindJSON(&novaCategoria); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resultado, err := h.categoriaService.GetCategoriaByName(novaCategoria.Nome)
	if resultado.Nome == novaCategoria.Nome || err == nil {
		if resultado.Nome != categoria.Nome {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Já existe uma categoria com esse nome!"})
			return
		}
	}
	if err := h.categoriaService.UpdateCategoria(&novaCategoria); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novaCategoria)
}
