package user_services

import (
	Entidades "integrador/modulos/user/entities"

	"golang.org/x/crypto/bcrypt"
)

func (s *UserService) UpdateUser(novousuario *Entidades.Usuario, usuarioAntigo *Entidades.Usuario) error {

	if novousuario.Email != usuarioAntigo.Email {
		_, err := s.repo.GetByEmail(novousuario.Email)
		if err == nil {
			return erroEmail()
		}
	}

	if novousuario.Senha != usuarioAntigo.Senha && novousuario.Senha != "" {
		if len(novousuario.Senha) <= 8 {
			return erroSenha()
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(novousuario.Senha), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		novousuario.Senha = string(hashedPassword)
	} else {
		novousuario.Senha = usuarioAntigo.Senha
	}

	return s.repo.Update(novousuario)
}
