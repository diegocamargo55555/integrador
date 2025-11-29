package services

import (
	Entidades "integrador/modulos/variado/entities"
)

func (s *GastoVariadoService) GetGastoById(uuid string) (*Entidades.Variado, error) {
	return s.repo.GetByGastoID(uuid)
}
