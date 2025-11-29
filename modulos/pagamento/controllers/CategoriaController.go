package controllers

import (
	"net/http"
	"time"

	entities "integrador/modulos/pagamento/entities"
	services "integrador/modulos/pagamento/services"

	"github.com/gin-gonic/gin"
)

type PagamentoController struct {
	pagamentoService services.PagamentoService
}

func NewPagamentoController(pagamentoService *services.PagamentoService) *PagamentoController {
	return &PagamentoController{pagamentoService: *pagamentoService}
}
func (h *PagamentoController) CreatePagamento(c *gin.Context) {
	var pagamento entities.Pagamento

	if err := c.ShouldBindJSON(&pagamento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pagamento.CreatedAt = time.Now()
	pagamento.UpdatedAt = time.Now()
	if err := h.pagamentoService.CreatePagamentoService(&pagamento); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, pagamento)
}

func (h *PagamentoController) DeletePagamento(c *gin.Context) {
	uuid := c.Param("ID")
	if err := h.pagamentoService.DeletePagamento(uuid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Pagamento deletado!"})
}

func (h *PagamentoController) GetPagamento(c *gin.Context) {
	uuid := c.Param("ID")
	categoria, err := h.pagamentoService.GetPagamentoById(uuid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pagamento não encontrado!"})
		return
	}
	c.JSON(http.StatusOK, categoria)
}

func (h *PagamentoController) ListPagamentos(c *gin.Context) {
	categorias, err := h.pagamentoService.GetAllCategorias()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categorias)
}

func (h *PagamentoController) UpdatePagamento(c *gin.Context) {
	id := c.Param("ID")
	pagamento, err := h.pagamentoService.GetPagamentoById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categoria não encontrada!"})
		return
	}
	var novoPagamento entities.Pagamento = *pagamento
	if err := c.ShouldBindJSON(&novoPagamento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.pagamentoService.UpdatePagamento(&novoPagamento); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, novoPagamento)
}
