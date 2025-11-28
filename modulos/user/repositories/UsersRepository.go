package repositories

import (
	Entidades "integrador/modulos/user/entities"

	"gorm.io/gorm"
)

type UserRepository struct {
	Db *gorm.DB
}

func NewCategoryRepository(Db *gorm.DB) *UserRepository {
	return &UserRepository{Db: Db}
}

func (r *UserRepository) GetAllUsers() ([]Entidades.Usuario, error) {
	var users []Entidades.Usuario
	resultado := r.Db.Find(&users)
	return users, resultado.Error
}

func (r *UserRepository) GetByName(name string) (*Entidades.Usuario, error) {
	var user Entidades.Usuario
	result := r.Db.Where("nome = ?", name).First(&user)
	return &user, result.Error
}

func (r *UserRepository) GetByID(uuid string) (*Entidades.Usuario, error) {
	var user Entidades.Usuario
	result := r.Db.Where("id = ?", uuid).First(&user)
	return &user, result.Error
}
func (r *UserRepository) Create(user *Entidades.Usuario) error {
	result := r.Db.Create(user)
	return result.Error
}

func (r *UserRepository) Update(user *Entidades.Usuario) error {
	result := r.Db.Save(user)
	return result.Error
}
func (r *UserRepository) Delete(uuid string) error {
	result := r.Db.Where("ID = ?", uuid).Delete(&Entidades.Usuario{})
	return result.Error
}
