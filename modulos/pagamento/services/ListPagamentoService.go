package services

import (
	Entidades "integrador/modulos/pagamento/entities"
)

func (s *PagamentoService) GetAllCategorias() ([]Entidades.Pagamento, error) {
	return s.repo.GetAll()
}
