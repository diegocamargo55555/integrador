package services

import (
	Entidades "integrador/modulos/gasto/entities"
)

func (s *GastoService) UpdateGasto(novoGasto *Entidades.Gasto, gasto *Entidades.Gasto) error {

	resultado, err := s.GetGastoByName(novoGasto.Nome)
	if resultado.Nome == novoGasto.Nome || err == nil {
		if resultado.Nome != gasto.Nome {
			err := erroNome()
			return err
		}
	}
	if novoGasto.Valor < 0 {
		err := erroValor()
		return err
	}
	return s.repo.Update(novoGasto)
}
