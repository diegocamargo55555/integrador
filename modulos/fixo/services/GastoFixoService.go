package services

import (
	"integrador/modulos/fixo/repositories"
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
		description: "A data de vencimento é obrigatoria!",
	}
}

type GastoFixoService struct {
	repo *repositories.GastoFixoRepository
}

func NewGastoFixoService(repo *repositories.GastoFixoRepository) *GastoFixoService {
	return &GastoFixoService{repo: repo}
}
