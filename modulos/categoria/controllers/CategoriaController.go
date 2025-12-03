package controllers

import (
	"net/http"
	"time"

	entities "integrador/modulos/categoria/entities"
	services "integrador/modulos/categoria/services"

	"github.com/gin-gonic/gin"
)

type CategoriaController struct {
	categoriaService services.CategoriaService
}

func NewCategoriaController(categoriaService *services.CategoriaService) *CategoriaController {
	return &CategoriaController{categoriaService: *categoriaService}
}
func (h *CategoriaController) CreateCategoria(c *gin.Context) {
	var categoria entities.Categoria

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

func (h *CategoriaController) DeleteCategoria(c *gin.Context) {
	uuid := c.Param("ID")
	if err := h.categoriaService.DeleteCategoria(uuid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Categoria deletada!"})
}

func (h *CategoriaController) GetCategoria(c *gin.Context) {
	uuid := c.Param("ID")
	categoria, err := h.categoriaService.GetCategoriaById(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categoria não encontrada!"})
		return
	}
	c.JSON(http.StatusOK, categoria)
}

func (h *CategoriaController) ListCategorias(c *gin.Context) {
	categorias, err := h.categoriaService.GetAllCategorias()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categorias)
}

func (h *CategoriaController) ListUserCategorias(c *gin.Context) {
	uuid := c.Param("ID")
	categorias, err := h.categoriaService.GetByUserId(uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categorias)
}

func (h *CategoriaController) UpdateCategoria(c *gin.Context) {
	id := c.Param("ID")
	categoria, err := h.categoriaService.GetCategoriaById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categoria não encontrada!"})
		return
	}
	var novaCategoria entities.Categoria = *categoria
	if err := c.ShouldBindJSON(&novaCategoria); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.categoriaService.UpdateCategoria(&novaCategoria, categoria); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novaCategoria)
}
