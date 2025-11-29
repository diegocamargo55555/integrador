package user_services

import (
	Entidades "integrador/modulos/user/entities"
)

func (r *UserService) GetByID(uuid string) (*Entidades.Usuario, error) {
	var user Entidades.Usuario
	result := r.repo.Db.Where("id = ?", uuid).First(&user)
	return &user, result.Error
}
