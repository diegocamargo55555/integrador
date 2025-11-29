package controllers

import (
	"net/http"

	entities "integrador/modulos/fixo/entities"
	services "integrador/modulos/fixo/services"

	"github.com/gin-gonic/gin"
)

type GastoFixoController struct {
	gastoFixoService services.GastoFixoService
}

func NewGastoFixoController(gastoFixoService *services.GastoFixoService) *GastoFixoController {
	return &GastoFixoController{gastoFixoService: *gastoFixoService}
}
func (h *GastoFixoController) CreateGastoFixo(c *gin.Context) {
	var fixo entities.Fixo

	if err := c.ShouldBindJSON(&fixo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.gastoFixoService.CreateFixoService(&fixo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, fixo)
}

func (h *GastoFixoController) GetGastoFixo(c *gin.Context) {
	uuid := c.Param("ID")
	gasto, err := h.gastoFixoService.GetGastoById(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gasto não encontrado!"})
		return
	}
	c.JSON(http.StatusOK, gasto)
}

func (h *GastoFixoController) ListGastosFixo(c *gin.Context) {
	gastos, err := h.gastoFixoService.GetAllGastos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gastos)
}

func (h *GastoFixoController) UpdateGasto(c *gin.Context) {
	uuid := c.Param("ID")
	var novoGasto entities.Fixo
	if err := c.ShouldBindJSON(&novoGasto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	novoGasto.GastoID = uuid
	if err := h.gastoFixoService.UpdateGastoFixo(&novoGasto); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novoGasto)
}
