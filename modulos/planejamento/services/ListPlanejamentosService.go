package service

import (
	Entidades "integrador/modulos/planejamento/entities"
)

func (r *PlanejamentoService) ListPlanejamentoService() ([]Entidades.Planejamento, error) {
	var planejamentos []Entidades.Planejamento
	resultado := r.repo.Db.Find(&planejamentos)
	return planejamentos, resultado.Error
}
