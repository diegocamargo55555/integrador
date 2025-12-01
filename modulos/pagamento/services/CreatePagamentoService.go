package services

import (
	Entidades "integrador/modulos/pagamento/entities"
)

func (s *PagamentoService) CreatePagamentoService(pagamento *Entidades.Pagamento) error {
	resultado, err := s.GetPagamentoById(pagamento.GastoID)
	if err == nil {
		err := erroGasto(resultado.Tipo)
		return err

	}
	if pagamento.Tipo == "" {
		err := erroTipo()
		return err
	}
	return s.repo.Create(pagamento)
}
