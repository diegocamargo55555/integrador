package user_services

import (
	Entidades "integrador/modulos/user/entities"
)

func (r *UserService) ListUserService() ([]Entidades.Usuario, error) {
	var users []Entidades.Usuario
	resultado := r.repo.Db.Find(&users)
	return users, resultado.Error
}
