package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) GetByUserId(uuid string) ([]Entidades.Gasto, error) {
	return s.repo.GetByUserId(uuid)
}
