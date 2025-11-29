package user_services

import (
	Entidades "integrador/modulos/user/entities"
)

func (r *UserService) DeleteUserService(uuid string) error {
	result := r.repo.Db.Where("ID = ?", uuid).Delete(&Entidades.Usuario{})
	return result.Error
}
