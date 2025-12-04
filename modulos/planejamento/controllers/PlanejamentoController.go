package controller

import (
	"net/http"
	"time"

	gasto_entities "integrador/modulos/gasto/entities"
	gasto_services "integrador/modulos/gasto/services"
	
	entities "integrador/modulos/planejamento/entities"
	services "integrador/modulos/planejamento/services"

	"github.com/gin-gonic/gin"
)

type PlanejamentoController struct {
	planejamentoService services.PlanejamentoService
	gastoService        gasto_services.GastoService 
}

func NewPlanejamentoController(pService *services.PlanejamentoService, gService *gasto_services.GastoService) *PlanejamentoController {
	return &PlanejamentoController{
		planejamentoService: *pService,
		gastoService:        *gService,
	}
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
	planejamentos, err := h.planejamentoService.GetByUserId(uuid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, planejamentos)
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
func (h *PlanejamentoController) DepositarPlanejamento(c *gin.Context) {
	id := c.Param("ID")
	
	var input struct {
		Valor float64 `json:"valor"`
		Data  string  `json:"data"` 
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	meta, err := h.planejamentoService.GetPlanejamentoById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Meta não encontrada"})
		return
	}

	meta.Valor_Atual += input.Valor
	if err := h.planejamentoService.UpdatePlanejamento(meta); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar meta: " + err.Error()})
		return
	}

	novoGasto := gasto_entities.Gasto{
		Nome:        "Depósito Meta: " + meta.Nome,
		Valor:       input.Valor,
		Data:        input.Data, 
		Fixo:        false,
		Foi_Pago:    true,
		PlanejamentoId: &meta.ID,
		UsuarioId:   meta.UsuarioId,
		CategoriaId: "",
	}

	if meta.CategoriaId != "" {
		novoGasto.CategoriaId = meta.CategoriaId
	}

	if err := h.gastoService.CreateGastoService(&novoGasto); err != nil {

		c.JSON(http.StatusOK, gin.H{
			"message": "Depósito feito, mas erro ao registrar gasto.", 
			"error": err.Error(),
			"novo_saldo": meta.Valor_Atual,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Depósito realizado e despesa registrada!", 
		"novo_saldo": meta.Valor_Atual,
	})
}