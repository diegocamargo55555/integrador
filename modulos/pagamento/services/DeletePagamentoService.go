package services

func (s *PagamentoService) DeletePagamento(uuid string) error {
	gasto, err := s.repoGasto.GetByID(uuid)
	if err != nil {
		err := erroGastoNaoExiste()
		return err
	}
	user, err := s.repoUser.GetByID(gasto.UsuarioId)
	if err != nil {
		err := erroUser()
		return err
	}
	user.Saldo = user.Saldo + gasto.Valor
	s.repoUser.Update(user)
	return s.repo.Delete(uuid)
}
