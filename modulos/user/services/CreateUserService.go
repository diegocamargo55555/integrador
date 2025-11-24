package user_services

import (
	"errors"
	"integrador/shared/migration"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)
func CreateUserService(db *gorm.DB, nome string, email string, senha string) (*migration.Usuario, error) {
	var usuarioExistente migration.Usuario
	result := db.Where("email = ?", email).First(&usuarioExistente)
	if result.Error == nil {
		return nil, errors.New("email já está em uso")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(senha), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("erro ao encriptar a senha")
	}

	novoUsuario := migration.Usuario{
		Nome:  nome,
		Email: email,
		Senha: string(hashedPassword),
	}

	if err := db.Create(&novoUsuario).Error; err != nil {
		return nil, err
	}

	return &novoUsuario, nil
}
