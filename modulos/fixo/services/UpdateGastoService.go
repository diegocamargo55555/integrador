package services

import (
	Entidades "integrador/modulos/fixo/entities"
)

func (s *GastoFixoService) UpdateGastoFixo(novoGasto *Entidades.Fixo) error {
	if novoGasto.Data_Vencimento == "" {
		err := erroData()
		return err
	}
	return s.repo.Update(novoGasto)
}
