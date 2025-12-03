package entrada_service

import (
	Entidades "integrador/modulos/entrada/entities"
)

func (s *EntradaService) GetByUserId(uuid string) ([]Entidades.Entrada, error) {
	return s.repo.GetByUserId(uuid)
}
