package services

import (
	Entidades "integrador/modulos/credito/entities"
	"time"
)

func (s *CreditoService) UpdateCredito(novoCredito *Entidades.Credito) error {
	resultCredito, err := s.repo.GetByGastoID(novoCredito.GastoID)
	if err == nil {
		err := erroCredito(resultCredito.Data_Vencimento)
		return err
	}
	resultadoPagamento, err := s.repoPaga.GetByID(novoCredito.GastoID)
	if err != nil {
		err := erroPagamento()
		return err
	}
	if novoCredito.Data_Vencimento == "" {
		err := erroData()
		return err
	}
	resultadoPagamento.UpdatedAt = time.Now()
	s.repoPaga.Update(resultadoPagamento)
	return s.repo.Update(novoCredito)
}
