package services

import (
	Entidades "integrador/modulos/fixo/entities"
	"time"
)

func (s *GastoFixoService) CreateFixoService(fixo *Entidades.Fixo) error {
	resultFixo, err := s.repo.GetByGastoID(fixo.GastoID)
	if err == nil {
		err := erroGastoFixo(resultFixo.Data_Vencimento)
		return err
	}
	resultGasto, err := s.repoGasto.GetByID(fixo.GastoID)

	if err != nil {
		err := erroGastoId()
		return err
	}
	if fixo.Data_Vencimento == "" {
		err := erroData()
		return err
	}
	resultGasto.UpdatedAt = time.Now()
	s.repoGasto.Update(resultGasto)
	return s.repo.Create(fixo)
}
