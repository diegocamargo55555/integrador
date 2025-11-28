package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) CreateGastoService(gasto *Entidades.Gasto) error {
	resultado, err := s.repo.GetByName(gasto.Nome)
	if resultado.Nome == gasto.Nome || err == nil {
		err := erroNome()
		return err
	}
	if gasto.Valor < 0 {
		err := erroValor()
		return err
	}
	return s.repo.Create(gasto)
}
