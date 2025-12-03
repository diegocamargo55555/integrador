package services

import (
	gastos "integrador/modulos/gasto/repositories"
	"integrador/modulos/pagamento/repositories"
	user "integrador/modulos/user/repositories"
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
		description: "Algo deu errado! Este gasto não existe!",
	}
}

type PagamentoService struct {
	repo      *repositories.PagamentoRepository
	repoGasto *gastos.GastoRepository
	repoUser  *user.UserRepository
}

func NewPagamentoService(repo *repositories.PagamentoRepository, repoGasto *gastos.GastoRepository, repoUser *user.UserRepository) *PagamentoService {
	return &PagamentoService{repo: repo, repoGasto: repoGasto, repoUser: repoUser}
}