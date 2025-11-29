package user_services

import (
	Entidades "integrador/modulos/user/entities"
	"time"
)

func (s *UserService) UpdateUser(novousuario *Entidades.Usuario, categoria *Entidades.Usuario) error {

	resultado, err := s.repo.GetByName(novousuario.Nome)
	if resultado.Email == novousuario.Email || err == nil {
		err := erroEmail()
		return err
	}
	if len(novousuario.Senha) <= 8 {
		err := erroSenha()
		return err
	}
	dataNascimento := time.Time(novousuario.Data_Nascimento)
	if dataNascimento.AddDate(18, 0, 0).After(time.Now()) {
		return erroMenorDeIdade()
	}

	return s.repo.Update(categoria)
}
