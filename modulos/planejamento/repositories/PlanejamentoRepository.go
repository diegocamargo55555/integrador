package repositories

import (
	Entidades "integrador/modulos/planejamento/entities"

	"gorm.io/gorm"
)

type PlanejamentoRepository struct {
	Db *gorm.DB
}

func NewPlanejamentoRepository(Db *gorm.DB) *PlanejamentoRepository {
	return &PlanejamentoRepository{Db: Db}
}

func (r *PlanejamentoRepository) GetAll() ([]Entidades.Planejamento, error) {
	var planejamentos []Entidades.Planejamento
	resultado := r.Db.Find(&planejamentos)
	return planejamentos, resultado.Error
}

func (r *PlanejamentoRepository) GetByID(uuid string) (*Entidades.Planejamento, error) {
	var planejamento Entidades.Planejamento
	result := r.Db.Where("id = ?", uuid).First(&planejamento)
	return &planejamento, result.Error
}

func (r *PlanejamentoRepository) Create(planejamento *Entidades.Planejamento) error {
	result := r.Db.Create(planejamento)
	return result.Error
}

func (r *PlanejamentoRepository) Update(planejamento *Entidades.Planejamento) error {
	result := r.Db.Save(planejamento)
	return result.Error
}

func (r *PlanejamentoRepository) Delete(uuid string) error {
	result := r.Db.Where("ID = ?", uuid).Delete(&Entidades.Planejamento{})
	return result.Error
}
