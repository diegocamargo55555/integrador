package services

import (
	Entidades "integrador/modulos/pagamento/entities"
)

func (s *PagamentoService) UpdatePagamento(novoPagamento *Entidades.Pagamento) error {
	if novoPagamento.Tipo == "" {
		err := erroTipo()
		return err
	}
	return s.repo.Update(novoPagamento)
}
