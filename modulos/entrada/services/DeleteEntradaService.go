package entrada_service

import (
	Entidades "integrador/modulos/entrada/entities"
)

func (r *EntradaService) DeleteEntradaService(uuid string) error {
	result := r.repo.Db.Where("ID = ?", uuid).Delete(&Entidades.Entrada{})
	return result.Error
}
