package user_services

import (
	"integrador/modulos/user/repositories"
)

type RequestError struct {
	description string

	Err error
}

func (r *RequestError) Error() string {
	return (r.description)
}

func erroEmail() error {
	return &RequestError{
		description: "Já existe uma conta com esse email!",
	}
}

func erroSenha() error {
	return &RequestError{
		description: "O senha deve conter 8 ou mais digitos!",
	}
}
func erroMenorDeIdade() error {
	return &RequestError{
		description: "Necessita ter mais de 18 anos para se cadastrar",
	}
}

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}
