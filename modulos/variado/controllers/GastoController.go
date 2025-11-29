package controllers

import (
	"net/http"

	entities "integrador/modulos/variado/entities"
	services "integrador/modulos/variado/services"

	"github.com/gin-gonic/gin"
)

type GastoVariadoController struct {
	gastoVariadoService services.GastoVariadoService
}

func NewGastoVariadoController(gastoVariadoService *services.GastoVariadoService) *GastoVariadoController {
	return &GastoVariadoController{gastoVariadoService: *gastoVariadoService}
}
func (h *GastoVariadoController) CreateGastoVariado(c *gin.Context) {
	var variado entities.Variado

	if err := c.ShouldBindJSON(&variado); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.gastoVariadoService.CreateVariadoService(&variado); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, variado)
}

func (h *GastoVariadoController) GetGastoVariado(c *gin.Context) {
	uuid := c.Param("ID")
	gasto, err := h.gastoVariadoService.GetGastoById(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gasto não encontrado!"})
		return
	}
	c.JSON(http.StatusOK, gasto)
}

func (h *GastoVariadoController) ListGastosVariado(c *gin.Context) {
	gastos, err := h.gastoVariadoService.GetAllGastos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gastos)
}

func (h *GastoVariadoController) UpdateGasto(c *gin.Context) {
	print("AQUI3!")
	uuid := c.Param("ID")
	var novoGasto entities.Variado
	if err := c.ShouldBindJSON(&novoGasto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	novoGasto.GastoID = uuid
	if err := h.gastoVariadoService.UpdateGastoVariado(&novoGasto); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novoGasto)
}
