package entrada_service

import (
	Entidades "integrador/modulos/entrada/entities"
)

func (s *EntradaService) UpdateEntrada(entrada *Entidades.Entrada) error {

	if entrada.Valor < 0 {
		return erroValor()
	}

	return s.repo.Update(entrada)
}