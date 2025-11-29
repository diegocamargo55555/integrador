package services

import (
	Entidades "integrador/modulos/credito/entities"
)

func (s *CreditoService) CreateCreditoService(credito *Entidades.Credito) error {
	if credito.Data_Vencimento == "" {
		err := erroData()
		return err
	}
	return s.repo.Create(credito)
}
