package services

import (
	Entidades "integrador/modulos/variado/entities"
)

func (s *GastoVariadoService) GetAllGastos() ([]Entidades.Variado, error) {
	return s.repo.GetAll()
}
