package services

import (
	gasto "integrador/modulos/gasto/repositories"
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
func erroGastoId() error {
	return &RequestError{description: "Este gasto não existe!"}
}
func erroGastoFixo(data_vencimento string) error {
	return &RequestError{description: "Já existe um gasto fixo para este gasto com data de vencimento para " + data_vencimento + " !"}
}

type GastoVariadoService struct {
	repo      *repositories.GastoVariadoRepository
	repoGasto *gasto.GastoRepository
}

func NewGastoVariadoService(repo *repositories.GastoVariadoRepository, repoGasto *gasto.GastoRepository) *GastoVariadoService {
	return &GastoVariadoService{repo: repo, repoGasto: repoGasto}
}
