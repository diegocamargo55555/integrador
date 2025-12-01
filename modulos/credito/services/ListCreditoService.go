package services

import (
	Entidades "integrador/modulos/credito/entities"
)

func (s *CreditoService) GetAllCreditos() ([]Entidades.Credito, error) {
	return s.repo.GetAll()
}
