package services

import (
	credito "integrador/modulos/credito/repositories"
	gast "integrador/modulos/gasto/repositories"
	"integrador/modulos/pagamento/repositories"
	userRep "integrador/modulos/user/repositories"
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
func erroUser() error {
	return &RequestError{
		description: "Algo deu errado!",
	}
}
func erroGastoNaoExiste() error {
	return &RequestError{
		description: "O gasto que você está tentando pagar não existe!",
	}
}

type PagamentoService struct {
	repo        *repositories.PagamentoRepository
	repoCredito *credito.CreditoRepository
	repoUser    *userRep.UserRepository
	repoGasto   *gast.GastoRepository
}

func NewPagamentoService(repo *repositories.PagamentoRepository, repoCredito *credito.CreditoRepository, repoUser *userRep.UserRepository, repoGasto *gast.GastoRepository) *PagamentoService {
	return &PagamentoService{repo: repo, repoCredito: repoCredito, repoUser: repoUser, repoGasto: repoGasto}
}
