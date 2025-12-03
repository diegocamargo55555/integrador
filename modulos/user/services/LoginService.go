package user_services

import (
	"errors"
	"integrador/shared/auth"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type LoginResponse struct {
	Token string `json:"token"`
	User  struct {
		ID    string `json:"id"`
		Nome  string `json:"nome"`
		Email string `json:"email"`
	} `json:"user"`
}

func (s *UserService) LoginService(email, senha string) (*LoginResponse, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return nil, errors.New("usuário ou senha inválidos")
	}

	match := auth.CheckPasswordHash(senha, user.Senha)
	if !match {
		return nil, errors.New("usuário ou senha inválidos")
	}

	generateToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"id": user.ID, "exp": time.Now().Add(time.Hour * 24).Unix()})
	token, err := generateToken.SignedString([]byte("chave"))

	if err != nil {
		return nil, errors.New("erro ao gerar token")
	}

	response := &LoginResponse{
		Token: token,
	}
	response.User.ID = user.ID
	response.User.Nome = user.Nome
	response.User.Email = user.Email

	return response, nil
}
