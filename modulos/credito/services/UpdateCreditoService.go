package services

import (
	Entidades "integrador/modulos/credito/entities"
)

func (s *CreditoService) UpdateCredito(novoCredito *Entidades.Credito) error {
	if novoCredito.Data_Vencimento == "" {
		err := erroData()
		return err
	}
	return s.repo.Update(novoCredito)
}
