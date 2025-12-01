package services

import (
	Entidades "integrador/modulos/variado/entities"
	"time"
)

func (s *GastoVariadoService) UpdateGastoVariado(novoGasto *Entidades.Variado) error {
	resultVariado, err := s.repo.GetByGastoID(novoGasto.GastoID)
	if err == nil {
		err := erroGastoFixo(resultVariado.Data_Gasto)
		return err
	}
	resultGasto, err := s.repoGasto.GetByID(novoGasto.GastoID)

	if err != nil {
		err := erroGastoId()
		return err
	}
	if novoGasto.Data_Gasto == "" {
		err := erroData()
		return err
	}
	resultGasto.UpdatedAt = time.Now()
	s.repoGasto.Update(resultGasto)
	return s.repo.Update(novoGasto)
}
