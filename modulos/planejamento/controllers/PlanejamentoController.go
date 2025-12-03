package controller

import (
	"net/http"
	"time"

	entities "integrador/modulos/planejamento/entities"
	services "integrador/modulos/planejamento/services"

	"github.com/gin-gonic/gin"
)

type PlanejamentoController struct {
	planejamentoService services.PlanejamentoService
}

func NewPlanejamentoController(planejamentoService *services.PlanejamentoService) *PlanejamentoController {
	return &PlanejamentoController{planejamentoService: *planejamentoService}
}

func (h *PlanejamentoController) CreatePlanejamento(c *gin.Context) {
	var planejamento entities.Planejamento

	if err := c.ShouldBindJSON(&planejamento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	planejamento.CreatedAt = time.Now()
	planejamento.UpdatedAt = time.Now()
	if err := h.planejamentoService.CreatePlanejamentoService(&planejamento); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, planejamento)
}

func (h *PlanejamentoController) DeletePlanejamento(c *gin.Context) {
	uuid := c.Param("ID")
	if err := h.planejamentoService.DeletePlanejamento(uuid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Planejamento deletado!"})
}

func (h *PlanejamentoController) GetPlanejamento(c *gin.Context) {
	uuid := c.Param("ID")
	planejamento, err := h.planejamentoService.GetPlanejamentoById(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Planejamento não encontrado!"})
		return
	}
	c.JSON(http.StatusOK, planejamento)
}

func (h *PlanejamentoController) ListPlanejamentos(c *gin.Context) {
	planejamentos, err := h.planejamentoService.ListPlanejamentoService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, planejamentos)
}
func (h *PlanejamentoController) ListUserPlanejamentos(c *gin.Context) {
	uuid := c.Param("ID")
	categorias, err := h.planejamentoService.GetByUserId(uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categorias)
}
func (h *PlanejamentoController) UpdatePlanejamento(c *gin.Context) {
	id := c.Param("ID")
	planejamento, err := h.planejamentoService.GetPlanejamentoById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Planejamento não encontrado!"})
		return
	}
	var novoPlanejamento entities.Planejamento = *planejamento
	if err := c.ShouldBindJSON(&novoPlanejamento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.planejamentoService.UpdatePlanejamento(&novoPlanejamento); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novoPlanejamento)
}
