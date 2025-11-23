package repositories

import (
	Entidades "integrador/modulos/categoria/entities"

	"gorm.io/gorm"
)

type CategoriaRepository struct {
	Db *gorm.DB
}

func NewCategoryRepository(Db *gorm.DB) *CategoriaRepository {
	return &CategoriaRepository{Db: Db}
}

func (r *CategoriaRepository) GetAll() ([]Entidades.Categoria, error) {
	var categorias []Entidades.Categoria
	resultado := r.Db.Find(&categorias)
	return categorias, resultado.Error
}

func (r *CategoriaRepository) GetByID(uuid string) (*Entidades.Categoria, error) {
	print("ID" + uuid)
	var categoria Entidades.Categoria
	result := r.Db.Where("id = ?", uuid).First(&categoria)
	return &categoria, result.Error
}

func (r *CategoriaRepository) Create(categoria *Entidades.Categoria) error {
	result := r.Db.Create(categoria)
	return result.Error
}

func (r *CategoriaRepository) Update(categoria *Entidades.Categoria) error {
	result := r.Db.Save(categoria)
	return result.Error
}
func (r *CategoriaRepository) Delete(uuid string) error {
	result := r.Db.Where("ID = ?", uuid).Delete(&Entidades.Categoria{})
	return result.Error
}
