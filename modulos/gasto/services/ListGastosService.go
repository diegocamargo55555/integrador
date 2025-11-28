package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) GetAllGastos() ([]Entidades.Gasto, error) {
	return s.repo.GetAll()
}
