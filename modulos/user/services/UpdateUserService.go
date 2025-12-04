package user_services

import (
	Entidades "integrador/modulos/user/entities"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func (s *UserService) UpdateUser(novousuario *Entidades.Usuario, usuarioAntigo *Entidades.Usuario) error {

	if novousuario.Email != usuarioAntigo.Email {
		_, err := s.repo.GetByEmail(novousuario.Email)
		if err == nil {
			return erroEmail()
		}
	}

	dataNascimento := time.Time(novousuario.Data_Nascimento)
	if dataNascimento.AddDate(18, 0, 0).After(time.Now()) {
		return erroMenorDeIdade()
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