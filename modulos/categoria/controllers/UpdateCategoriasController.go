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
	var novaCategoria Entidades.Categoria
	// var categoria Entidades.Categoria

	if err := c.ShouldBindJSON(&categoria); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if novaCategoria.Nome == "" {
		novaCategoria.Nome = categoria.Nome
	}
	if novaCategoria.Cor == "" {
		novaCategoria.Cor = categoria.Cor
	}
	if novaCategoria.Limite == 0 {
		novaCategoria.Limite = categoria.Limite
	}
	if novaCategoria.Valor_Esperado == 0 {
		novaCategoria.Valor_Esperado = categoria.Valor_Esperado
	}
	novaCategoria.CreatedAt = categoria.CreatedAt
	novaCategoria.UpdatedAt = categoria.UpdatedAt
	novaCategoria.UsuarioId = categoria.UsuarioId
	novaCategoria.ID = id
	// categoria.ID = id
	if err := h.categoriaService.UpdateCategoria(&novaCategoria); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categoria)
}
