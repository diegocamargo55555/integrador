package services

import (
	Entidades "integrador/modulos/fixo/entities"
)

func (s *GastoFixoService) GetAllGastos() ([]Entidades.Fixo, error) {
	return s.repo.GetAll()
}
