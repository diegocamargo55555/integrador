package services

import (
	Entidades "integrador/modulos/credito/entities"
)

func (s *CreditoService) GetCreditoById(uuid string) (*Entidades.Credito, error) {
	return s.repo.GetByGastoID(uuid)
}
