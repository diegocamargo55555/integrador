package repositories

import (
	Entidades "integrador/modulos/gasto/entities"

	"gorm.io/gorm"
)

type GastoRepository struct {
	Db *gorm.DB
}

func NewGastoRepository(Db *gorm.DB) *GastoRepository {
	return &GastoRepository{Db: Db}
}

func (r *GastoRepository) GetAll() ([]Entidades.Gasto, error) {
	var gastos []Entidades.Gasto
	resultado := r.Db.Find(&gastos)
	return gastos, resultado.Error
}

func (r *GastoRepository) GetByName(name string) (*Entidades.Gasto, error) {
	var gasto Entidades.Gasto
	result := r.Db.Where("nome = ?", name).First(&gasto)
	return &gasto, result.Error
}
func (r *GastoRepository) GetByUserId(uuid string) ([]Entidades.Gasto, error) {
	var gastos []Entidades.Gasto
	result := r.Db.Where("usuario_id = ?", uuid).Find(&gastos)
	return gastos, result.Error
}
func (r *GastoRepository) GetByID(uuid string) (*Entidades.Gasto, error) {
	var gasto Entidades.Gasto
	result := r.Db.Where("id = ?", uuid).First(&gasto)
	return &gasto, result.Error
}

func (r *GastoRepository) Create(gasto *Entidades.Gasto) error {
	result := r.Db.Create(gasto)
	return result.Error
}

func (r *GastoRepository) Update(gasto *Entidades.Gasto) error {
	result := r.Db.Save(gasto)
	return result.Error
}
func (r *GastoRepository) Delete(uuid string) error {
	result := r.Db.Where("ID = ?", uuid).Delete(&Entidades.Gasto{})
	return result.Error
}
