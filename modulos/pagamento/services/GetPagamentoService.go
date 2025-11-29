package services

import (
	Entidades "integrador/modulos/pagamento/entities"
)

func (s *PagamentoService) GetPagamentoById(uuid string) (*Entidades.Pagamento, error) {
	return s.repo.GetByID(uuid)
}
