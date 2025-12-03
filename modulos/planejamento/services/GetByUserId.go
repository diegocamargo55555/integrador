package service

import (
	Entidades "integrador/modulos/planejamento/entities"
)

func (s *PlanejamentoService) GetByUserId(uuid string) ([]Entidades.Planejamento, error) {
	return s.repo.GetByUserId(uuid)
}
