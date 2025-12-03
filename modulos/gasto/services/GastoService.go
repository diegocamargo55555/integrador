package services

import (
	"integrador/modulos/gasto/repositories"
	planejamento "integrador/modulos/planejamento/repositories"
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
		description: "O valor não pode ser negativo!",
	}
}
func gastoNaoExiste() error {
	return &RequestError{
		description: "Este gasto não existe!",
	}
}
func planNaoExiste() error {
	return &RequestError{
		description: "Este planejamento não existe!",
	}
}

type GastoService struct {
	repo     *repositories.GastoRepository
	planRepo *planejamento.PlanejamentoRepository
}

func NewGastoService(repo *repositories.GastoRepository, planRepo *planejamento.PlanejamentoRepository) *GastoService {
	return &GastoService{repo: repo, planRepo: planRepo}
}
