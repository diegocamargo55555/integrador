package controllers

import services "integrador/modulos/categoria/services"

type CategoriaController struct {
	categoriaService services.CategoriaService
}

func NewCategoriaController(categoriaService *services.CategoriaService) *CategoriaController {
	return &CategoriaController{categoriaService: *categoriaService}
}
