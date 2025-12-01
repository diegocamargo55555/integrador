package services

import (
	gastoFixo "integrador/modulos/fixo/repositories"
	gasto "integrador/modulos/gasto/repositories"
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

func erroGastoId() error {
	return &RequestError{description: "Este gasto não existe!"}
}
func erroGastoFixo(data_vencimento string) error {
	return &RequestError{description: "Já existe um gasto fixo para este gasto com data de vencimento para " + data_vencimento + " !"}
}

type GastoFixoService struct {
	repo      *gastoFixo.GastoFixoRepository
	repoGasto *gasto.GastoRepository
}

func NewGastoFixoService(repo *gastoFixo.GastoFixoRepository, repoGasto *gasto.GastoRepository) *GastoFixoService {
	return &GastoFixoService{repo: repo, repoGasto: repoGasto}
}
