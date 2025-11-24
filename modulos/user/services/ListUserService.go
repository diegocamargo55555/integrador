package user_services

import (
	"integrador/shared/migration"

	"gorm.io/gorm"
)

func ListUserService(db *gorm.DB) ([]migration.Usuario, error) {
	var usuarios []migration.Usuario

	result := db.Find(&usuarios)

	if result.Error != nil {
		return nil, result.Error
	}

	return usuarios, nil
}
