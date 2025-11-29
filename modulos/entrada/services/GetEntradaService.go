package entrada_service

import (
	Entidades "integrador/modulos/entrada/entities"
)

func (r *EntradaService) GetByID(uuid string) (*Entidades.Entrada, error) {
	var user Entidades.Entrada
	result := r.repo.Db.Where("id = ?", uuid).First(&user)
	return &user, result.Error
}
