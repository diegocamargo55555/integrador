package service

import (
	Entidades "integrador/modulos/planejamento/entities"
)

func (s *PlanejamentoService) CreatePlanejamentoService(planejamento *Entidades.Planejamento) error {
	if planejamento.Valor_Desejado < 0 || planejamento.Estima_Deposito_Mensal < 0 {
		err := erroValor()
		return err
	}
	return s.repo.Create(planejamento)
}
