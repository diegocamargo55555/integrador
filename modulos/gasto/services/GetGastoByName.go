package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) GetGastoByName(name string) (*Entidades.Gasto, error) {
	return s.repo.GetByName(name)
}
