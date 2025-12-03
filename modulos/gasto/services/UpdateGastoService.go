package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) UpdateGasto(novoGasto *Entidades.Gasto, gasto *Entidades.Gasto) error {

	if novoGasto.Valor < 0 {
		err := erroValor()
		return err
	}
	if gasto.PlanejamentoId != nil && novoGasto.PlanejamentoId != nil {
		plan, err := s.planRepo.GetByID(*gasto.PlanejamentoId)
		if err != nil {
			err := planNaoExiste()
			return err
		}
		plan.Valor_Atual -= gasto.Valor
		plan.Valor_Atual += novoGasto.Valor
		s.planRepo.Update(plan)
	} else {
		if gasto.PlanejamentoId == nil && novoGasto.PlanejamentoId != nil {
			plan, err := s.planRepo.GetByID(*gasto.PlanejamentoId)
			if err != nil {
				err := planNaoExiste()
				return err
			}
			plan.Valor_Atual += novoGasto.Valor
			s.planRepo.Update(plan)
		} else {
			if gasto.PlanejamentoId != nil && novoGasto.PlanejamentoId == nil {
				plan, err := s.planRepo.GetByID(*gasto.PlanejamentoId)
				if err != nil {
					err := planNaoExiste()
					return err
				}
				plan.Valor_Atual -= gasto.Valor
				s.planRepo.Update(plan)
			}
		}
	}
	return s.repo.Update(novoGasto)
}
