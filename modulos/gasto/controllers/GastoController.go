package controllers

import (
	"net/http"
	"time"

	entities "integrador/modulos/gasto/entities"
	services "integrador/modulos/gasto/services"

	"github.com/gin-gonic/gin"
)

type GastoController struct {
	gastoService services.GastoService
}

func NewGastoController(gastoService *services.GastoService) *GastoController {
	return &GastoController{gastoService: *gastoService}
}
func (h *GastoController) CreateGasto(c *gin.Context) {
	var gasto entities.Gasto

	if err := c.ShouldBindJSON(&gasto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	gasto.CreatedAt = time.Now()
	gasto.UpdatedAt = time.Now()
	if err := h.gastoService.CreateGastoService(&gasto); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gasto)
}
func (h *GastoController) ListUserGasto(c *gin.Context) {
	uuid := c.Param("ID")
	gastos, err := h.gastoService.GetByUserId(uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gastos)
}

func (h *GastoController) DeleteGasto(c *gin.Context) {
	uuid := c.Param("ID")
	if err := h.gastoService.DeleteGasto(uuid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Gasto deletado!"})
}

func (h *GastoController) GetGasto(c *gin.Context) {
	uuid := c.Param("ID")
	gasto, err := h.gastoService.GetGastoById(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gasto não encontrado!"})
		return
	}
	c.JSON(http.StatusOK, gasto)
}

func (h *GastoController) ListGastos(c *gin.Context) {
	gastos, err := h.gastoService.GetAllGastos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gastos)
}

func (h *GastoController) UpdateGasto(c *gin.Context) {
	id := c.Param("ID")
	gasto, err := h.gastoService.GetGastoById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gasto não encontrado!"})
		return
	}
	var novoGasto entities.Gasto = *gasto
	if err := c.ShouldBindJSON(&novoGasto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.gastoService.UpdateGasto(&novoGasto, gasto); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novoGasto)
}


