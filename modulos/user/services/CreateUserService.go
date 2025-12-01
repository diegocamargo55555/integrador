package user_services

import (
	Entidades "integrador/modulos/user/entities"
	"integrador/shared/auth"
	"time"
)

func (s *UserService) CreateUserService(user *Entidades.Usuario) error {
	resultado, err := s.repo.GetByID(user.Email)
	if resultado.Email == user.Email || err == nil {
		err := erroEmail()
		return err
	}

	if len(user.Senha) <= 8 {
		err := erroSenha()
		return err
	}

	dataNascimento := time.Time(user.Data_Nascimento)
	if dataNascimento.AddDate(18, 0, 0).After(time.Now()) {
		return erroMenorDeIdade()
	}

	hashedPassword, err := auth.HashPassword(user.Senha)
	if err != nil {
		return err
	}
	
	user.Senha = hashedPassword
	return s.repo.Create(user)

}
