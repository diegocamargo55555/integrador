package entrada_service

import (
	Entidades "integrador/modulos/entrada/entities"
)

func (r *EntradaService) ListEntradaService() ([]Entidades.Entrada, error) {
	var entradas []Entidades.Entrada
	resultado := r.repo.Db.Find(&entradas)
	return entradas, resultado.Error
}
