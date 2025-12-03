package entrada_controllers

import (
	entrada_entities "integrador/modulos/entrada/entities"
	entrada_services "integrador/modulos/entrada/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type EntradaController struct {
	entradaService entrada_services.EntradaService
}

func NewEntradaController(entradaService *entrada_services.EntradaService) *EntradaController {
	return &EntradaController{entradaService: *entradaService}
}

func (h *EntradaController) CreateEntrada(c *gin.Context) {
	var entrada entrada_entities.Entrada

	if err := c.ShouldBindJSON(&entrada); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	entrada.CreatedAt = time.Now()
	entrada.UpdatedAt = time.Now()
	if err := h.entradaService.CreateEntradaService(&entrada); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, entrada)
}

func (h *EntradaController) ListEntrada(c *gin.Context) {
	entradas, err := h.entradaService.ListEntradaService()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, entradas)
}
func (h *EntradaController) ListUserEntradas(c *gin.Context) {
	uuid := c.Param("ID")
	entradas, err := h.entradaService.GetByUserId(uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, entradas)
}
func (h *EntradaController) DeleteEntradaService(c *gin.Context) {
	uuid := c.Param("ID")
	if err := h.entradaService.DeleteEntradaService(uuid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Entrada deletado!"})
}

func (h *EntradaController) GetEntrada(c *gin.Context) {
	uuid := c.Param("ID")
	antigaEntrada, err := h.entradaService.GetByID(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Entrada não encontrada!"})
		return
	}
	c.JSON(http.StatusOK, antigaEntrada)
}

func (h *EntradaController) UpdateEntrada(c *gin.Context) {
	id := c.Param("ID")
	antigaEntrada, err := h.entradaService.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Entrada não encontrada!"})
		return
	}
	var novaEntrada entrada_entities.Entrada = *antigaEntrada
	if err := c.ShouldBindJSON(&novaEntrada); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	novaEntrada.ID = id
	if err := h.entradaService.UpdateEntrada(&novaEntrada); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novaEntrada)
}
