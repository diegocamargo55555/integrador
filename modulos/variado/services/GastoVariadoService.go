package services

import (
	"integrador/modulos/variado/repositories"
)

type RequestError struct {
	description string

	Err error
}

func (r *RequestError) Error() string {
	return (r.description)
}

func erroData() error {
	return &RequestError{
		description: "A data de gasto é obrigatoria!",
	}
}

type GastoVariadoService struct {
	repo *repositories.GastoVariadoRepository
}

func NewGastoVariadoService(repo *repositories.GastoVariadoRepository) *GastoVariadoService {
	return &GastoVariadoService{repo: repo}
}
