package repositories

import (
	"gorm.io/gorm"
)

type UserRepository struct {
	Db *gorm.DB
}

