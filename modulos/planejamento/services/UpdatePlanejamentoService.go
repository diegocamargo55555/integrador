package service

import (
	Entidades "integrador/modulos/planejamento/entities"
)

func (s *PlanejamentoService) UpdatePlanejamento(novoPlanejamento *Entidades.Planejamento) error {
	if novoPlanejamento.Valor_Desejado < 0 || novoPlanejamento.Estima_Deposito_Mensal < 0 {
		err := erroValor()
		return err
	}
	return s.repo.Update(novoPlanejamento)
}
