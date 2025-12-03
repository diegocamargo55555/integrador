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
	gasto, err := s.repoGasto.GetByID(pagamento.GastoID)
	if err != nil {
		err := erroGastoNaoExiste()
		return err
	}
	user, err := s.repoUser.GetByID(gasto.UsuarioId)
	if err != nil {
		err := erroUser()
		return err
	}
	user.Saldo = user.Saldo - gasto.Valor
	s.repoUser.Update(user)
	return s.repo.Create(pagamento)
}















