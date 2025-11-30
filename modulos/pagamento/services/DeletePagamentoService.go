package services

func (s *PagamentoService) DeletePagamento(uuid string) error {
	s.repoCredito.Delete(uuid)
	return s.repo.Delete(uuid)
}
