package entrada_service

import (
	Entidades "integrador/modulos/entrada/entities"
)

func (s *EntradaService) CreateEntradaService(entrada *Entidades.Entrada) error {
	if entrada.Valor < 0 {
		err := erroValor()
		return err
	}
	return s.repo.Create(entrada)

}
