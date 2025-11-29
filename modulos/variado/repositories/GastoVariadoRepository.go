package repositories

import (
	Entidades "integrador/modulos/variado/entities"

	"gorm.io/gorm"
)

type GastoVariadoRepository struct {
	Db *gorm.DB
}

func NewGastoVariadoRepository(Db *gorm.DB) *GastoVariadoRepository {
	return &GastoVariadoRepository{Db: Db}
}

func (r *GastoVariadoRepository) GetAll() ([]Entidades.Variado, error) {
	var Variados []Entidades.Variado
	resultado := r.Db.Find(&Variados)
	return Variados, resultado.Error
}
func (r *GastoVariadoRepository) GetByGastoID(uuid string) (*Entidades.Variado, error) {
	var Variado Entidades.Variado
	result := r.Db.Where("gasto_id = ?", uuid).First(&Variado)
	return &Variado, result.Error
}

func (r *GastoVariadoRepository) Create(Variado *Entidades.Variado) error {
	result := r.Db.Create(Variado)
	return result.Error
}

func (r *GastoVariadoRepository) Update(Variado *Entidades.Variado) error {
	result := r.Db.Model(&Entidades.Variado{}).Where("gasto_id = ?", Variado.GastoID).Update("data_gasto", Variado.Data_Gasto)
	return result.Error
}
