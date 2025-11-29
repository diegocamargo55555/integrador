package services

import (
	"integrador/modulos/credito/repositories"
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

type CreditoService struct {
	repo *repositories.CreditoRepository
}

func NewCreditoService(repo *repositories.CreditoRepository) *CreditoService {
	return &CreditoService{repo: repo}
}
