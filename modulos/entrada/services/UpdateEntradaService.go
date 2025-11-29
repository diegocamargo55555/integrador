package entrada_service

import (
	Entidades "integrador/modulos/entrada/entities"
)

func (s *EntradaService) UpdateEntrada(novaentrada *Entidades.Entrada, entrada *Entidades.Entrada) error {

	if novaentrada.Valor < 0 {
		err := erroValor()
		return err
	}

	return s.repo.Update(entrada)
}
