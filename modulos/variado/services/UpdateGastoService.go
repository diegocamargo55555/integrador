package services

import (
	Entidades "integrador/modulos/variado/entities"
)

func (s *GastoVariadoService) UpdateGastoVariado(novoGasto *Entidades.Variado) error {
	if novoGasto.Data_Gasto == "" {
		err := erroData()
		return err
	}
	return s.repo.Update(novoGasto)
}
