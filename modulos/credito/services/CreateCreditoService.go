package services

import (
	Entidades "integrador/modulos/credito/entities"
	"time"
)

func (s *CreditoService) CreateCreditoService(credito *Entidades.Credito) error {
	resultCredito, err := s.repo.GetByGastoID(credito.GastoID)
	if err == nil {
		err := erroCredito(resultCredito.Data_Vencimento)
		return err
	}
	resultadoPagamento, err := s.repoPaga.GetByID(credito.GastoID)
	if err != nil {
		err := erroPagamento()
		return err
	}
	if credito.Data_Vencimento == "" {
		err := erroData()
		return err
	}
	resultadoPagamento.UpdatedAt = time.Now()
	s.repoPaga.Update(resultadoPagamento)
	return s.repo.Create(credito)
}
