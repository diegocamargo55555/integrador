package services

import "integrador/modulos/categoria/repositories"

type CategoriaService struct {
	repo *repositories.CategoriaRepository
}

func NewCategoriaService(repo *repositories.CategoriaRepository) *CategoriaService {
	return &CategoriaService{repo: repo}
}
