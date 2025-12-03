package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) CreateGastoService(gasto *Entidades.Gasto) error {
	if gasto.Valor < 0 {
		err := erroValor()
		return err
	}

	if gasto.PlanejamentoId != nil {
		plan, err := s.planRepo.GetByID(*gasto.PlanejamentoId)
		if err != nil {
			err := planNaoExiste()
			return err
		}
		plan.Valor_Atual += gasto.Valor
		s.planRepo.Update(plan)
	}

	return s.repo.Create(gasto)
}
