package services

func (s *GastoService) DeleteGasto(uuid string) error {
	result, err := s.repo.GetByID(uuid)
	if err != nil {
		err := gastoNaoExiste()
		return err
	}
	if result.PlanejamentoId != nil {
		plan, err := s.planRepo.GetByID(*result.PlanejamentoId)
		if err != nil {
			err := planNaoExiste()
			return err
		}
		plan.Valor_Atual -= result.Valor
		s.planRepo.Update(plan)
	}
	return s.repo.Delete(uuid)
}
