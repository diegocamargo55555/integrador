package services

import (
	Entidades "integrador/modulos/fixo/entities"
)

func (s *GastoFixoService) GetGastoById(uuid string) (*Entidades.Fixo, error) {
	return s.repo.GetByGastoID(uuid)
}
