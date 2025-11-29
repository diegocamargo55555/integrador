package service

import (
	"integrador/modulos/planejamento/repositories"
)

type RequestError struct {
	description string
	Err         error
}

func (r *RequestError) Error() string {
	return r.description
}

func erroValor() error {
	return &RequestError{
		description: "O valor não pode ser negativo!",
	}
}

type PlanejamentoService struct {
	repo *repositories.PlanejamentoRepository
}

func NewPlanejamentoService(repo *repositories.PlanejamentoRepository) *PlanejamentoService {
	return &PlanejamentoService{repo: repo}
}
