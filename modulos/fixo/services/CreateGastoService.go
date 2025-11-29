package services

import (
	Entidades "integrador/modulos/fixo/entities"
)

func (s *GastoFixoService) CreateFixoService(fixo *Entidades.Fixo) error {
	if fixo.Data_Vencimento == "" {
		err := erroData()
		return err
	}
	return s.repo.Create(fixo)
}
