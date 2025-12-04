package user_services

import (
	catEntidade "integrador/modulos/categoria/entities"
	Entidades "integrador/modulos/user/entities"
	"integrador/shared/auth"
	"time"
)

func (s *UserService) CreateUserService(user *Entidades.Usuario) error {
	resultado, err := s.repo.GetByEmail(user.Email)
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
	s.repo.Create(user)
	userNovo, errBusca := s.repo.GetByEmail(user.Email)
	if errBusca != nil {
		return errBusca
	}
	var catViagem catEntidade.Categoria
	catViagem.Nome = "Viagem"
	catViagem.Valor_Esperado = 100
	catViagem.Limite = 100
	catViagem.Cor = "#20774b"
	catViagem.UsuarioId = userNovo.ID
	catViagem.CreatedAt = time.Now()
	catViagem.UpdatedAt = time.Now()
	err = s.repoCat.Create(&catViagem)
	if err != nil {
		return err
	}
	var catMercado catEntidade.Categoria
	catMercado.Nome = "Mercado"
	catMercado.Valor_Esperado = 100
	catMercado.Limite = 100
	catMercado.UsuarioId = userNovo.ID
	catMercado.CreatedAt = time.Now()
	catMercado.UpdatedAt = time.Now()
	catMercado.Cor = "#f5cd48"
	err = s.repoCat.Create(&catMercado)
	if err != nil {
		return err
	}
	var catAlimentacao catEntidade.Categoria
	catAlimentacao.Nome = "Alimentação"
	catAlimentacao.Cor = "#f56848"
	catAlimentacao.Valor_Esperado = 100
	catAlimentacao.Limite = 100
	catAlimentacao.UsuarioId = userNovo.ID
	catAlimentacao.CreatedAt = time.Now()
	catAlimentacao.UpdatedAt = time.Now()
	err = s.repoCat.Create(&catAlimentacao)
	if err != nil {
		return err
	}
	var catLazer catEntidade.Categoria

	catLazer.Nome = "Lazer"
	catLazer.Cor = "#8a48f6"
	catLazer.Valor_Esperado = 100
	catLazer.Limite = 100
	catLazer.UsuarioId = userNovo.ID
	catLazer.CreatedAt = time.Now()
	catLazer.UpdatedAt = time.Now()
	err = s.repoCat.Create(&catLazer)
	return err
}
