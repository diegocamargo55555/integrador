package services

import (
	Entidades "integrador/modulos/variado/entities"
)

func (s *GastoVariadoService) CreateVariadoService(Variado *Entidades.Variado) error {
	if Variado.Data_Gasto == "" {
		err := erroData()
		return err
	}
	return s.repo.Create(Variado)
}
