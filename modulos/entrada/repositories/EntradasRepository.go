package repositories

import (
	Entidades "integrador/modulos/entrada/entities"

	"gorm.io/gorm"
)

type EntradaRepository struct {
	Db *gorm.DB
}

func NewEntradaRepository(Db *gorm.DB) *EntradaRepository {
	return &EntradaRepository{Db: Db}
}

func (r *EntradaRepository) GetAllEntradas() ([]Entidades.Entrada, error) {
	var entradas []Entidades.Entrada
	resultado := r.Db.Find(&entradas)
	return entradas, resultado.Error
}

func (r *EntradaRepository) GetByName(name string) (*Entidades.Entrada, error) {
	var entrada Entidades.Entrada
	result := r.Db.Where("nome = ?", name).First(&entrada)
	return &entrada, result.Error
}

func (r *EntradaRepository) GetByID(uuid string) (*Entidades.Entrada, error) {
	var entrada Entidades.Entrada
	result := r.Db.Where("id = ?", uuid).First(&entrada)
	return &entrada, result.Error
}
func (r *EntradaRepository) Create(entrada *Entidades.Entrada) error {
	result := r.Db.Create(entrada)
	return result.Error
}

func (r *EntradaRepository) Update(entrada *Entidades.Entrada) error {
	result := r.Db.Save(entrada)
	return result.Error
}
func (r *EntradaRepository) Delete(uuid string) error {
	result := r.Db.Where("ID = ?", uuid).Delete(&Entidades.Entrada{})
	return result.Error
}
