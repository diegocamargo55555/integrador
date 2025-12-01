package services

import (
	Entidades "integrador/modulos/variado/entities"
	"time"
)

func (s *GastoVariadoService) CreateVariadoService(variado *Entidades.Variado) error {
	resultVariado, err := s.repo.GetByGastoID(variado.GastoID)
	if err == nil {
		err := erroGastoFixo(resultVariado.Data_Gasto)
		return err
	}
	resultGasto, err := s.repoGasto.GetByID(variado.GastoID)

	if err != nil {
		err := erroGastoId()
		return err
	}
	if variado.Data_Gasto == "" {
		err := erroData()
		return err
	}
	resultGasto.UpdatedAt = time.Now()
	s.repoGasto.Update(resultGasto)
	return s.repo.Create(variado)
}
