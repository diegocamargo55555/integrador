package entrada_service

import (
	"integrador/modulos/entrada/repositories"
)

type RequestError struct {
	description string
	Err error
}

func (r *RequestError) Error() string {
	return (r.description)
}

func erroValor() error {
	return &RequestError{
		description: "O deve ser positivo!",
	}
}

type EntradaService struct {
	repo *repositories.EntradaRepository
}

func NewEntradaService(repo *repositories.EntradaRepository) *EntradaService {
	return &EntradaService{repo: repo}
}
