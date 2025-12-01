package controllers

import (
	"net/http"

	entities "integrador/modulos/credito/entities"
	services "integrador/modulos/credito/services"

	"github.com/gin-gonic/gin"
)

type CreditoController struct {
	CreditoService services.CreditoService
}

func NewCreditoController(creditoService *services.CreditoService) *CreditoController {
	return &CreditoController{CreditoService: *creditoService}
}
func (h *CreditoController) CreateCredito(c *gin.Context) {
	var credito entities.Credito

	if err := c.ShouldBindJSON(&credito); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.CreditoService.CreateCreditoService(&credito); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, credito)
}

func (h *CreditoController) GetCredito(c *gin.Context) {
	uuid := c.Param("ID")
	gasto, err := h.CreditoService.GetCreditoById(uuid)
	if err != nil {
		print(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Pagamento a credito não encontrado!"})
		return
	}
	c.JSON(http.StatusOK, gasto)
}

func (h *CreditoController) ListCredito(c *gin.Context) {
	gastos, err := h.CreditoService.GetAllCreditos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gastos)
}

func (h *CreditoController) UpdateCredito(c *gin.Context) {
	uuid := c.Param("ID")
	var novoGasto entities.Credito
	if err := c.ShouldBindJSON(&novoGasto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	novoGasto.GastoID = uuid
	if err := h.CreditoService.UpdateCredito(&novoGasto); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novoGasto)
}
