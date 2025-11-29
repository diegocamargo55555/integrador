package services

import (
	"integrador/modulos/categoria/repositories"
)

type RequestError struct {
	description string

	Err error
}

func (r *RequestError) Error() string {
	return (r.description)
}

func erroNome() error {
	return &RequestError{
		description: "Já existe uma categoria com esse nome!",
	}
}

func erroLimite() error {
	return &RequestError{
		description: "O valor não pode ser negativo!",
	}
}

type CategoriaService struct {
	repo *repositories.CategoriaRepository
}

func NewCategoriaService(repo *repositories.CategoriaRepository) *CategoriaService {
	return &CategoriaService{repo: repo}
}
