package service

import (
	Entidades "integrador/modulos/planejamento/entities"
)

func (s *PlanejamentoService) GetPlanejamentoById(uuid string) (*Entidades.Planejamento, error) {
	return s.repo.GetByID(uuid)
}
