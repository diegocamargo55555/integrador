package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) GetGastoById(uuid string) (*Entidades.Gasto, error) {
	return s.repo.GetByID(uuid)
}
