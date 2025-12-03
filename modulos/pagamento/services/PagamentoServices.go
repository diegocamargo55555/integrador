package services

import (
	"integrador/modulos/pagamento/repositories"
)

type RequestError struct {
	description string

	Err error
}

func (r *RequestError) Error() string {
	return (r.description)
}

func erroTipo() error {
	return &RequestError{
		description: "O tipo não pode ser vazio!",
	}
}
func erroGasto(tipo string) error {
	return &RequestError{
		description: " Já há um pagamento de" + tipo + "associado a este gasto! ",
	}
}

type PagamentoService struct {
	repo        *repositories.PagamentoRepository
}

func NewPagamentoService(repo *repositories.PagamentoRepository) *PagamentoService {
	return &PagamentoService{repo: repo}
}
