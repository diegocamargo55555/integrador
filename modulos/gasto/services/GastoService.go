package services

import (
	"integrador/modulos/gasto/repositories"
)

type RequestError struct {
	description string

	Err error
}

func (r *RequestError) Error() string {
	return (r.description)
}

func erroNome() error {
	return &RequestError{
		description: "Já existe um gasto com esse nome!",
	}
}

func erroValor() error {
	return &RequestError{
		description: "O valor não pode ser negativo!",
	}
}

type GastoService struct {
	repo *repositories.GastoRepository
}

func NewGastoService(repo *repositories.GastoRepository) *GastoService {
	return &GastoService{repo: repo}
}
