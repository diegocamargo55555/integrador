package services

import (
	"integrador/modulos/credito/repositories"
	pagamento "integrador/modulos/pagamento/repositories"
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

func erroCredito(data string) error {
	return &RequestError{
		description: "Já há um pagamento a credito associado a este gasto com data de vencimento para " + data + "!",
	}
}

func erroPagamento() error {
	return &RequestError{
		description: "Não existe um pagamento associado a este gasto!",
	}
}

type CreditoService struct {
	repo     *repositories.CreditoRepository
	repoPaga *pagamento.PagamentoRepository
}

func NewCreditoService(repo *repositories.CreditoRepository, repoPaga *pagamento.PagamentoRepository) *CreditoService {
	return &CreditoService{repo: repo, repoPaga: repoPaga}
}
