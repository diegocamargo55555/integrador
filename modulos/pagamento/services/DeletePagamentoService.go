package services

func (s *PagamentoService) DeletePagamento(uuid string) error {
	return s.repo.Delete(uuid)
}
