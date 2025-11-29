package repositories

import (
	Entidades "integrador/modulos/fixo/entities"

	"gorm.io/gorm"
)

type GastoFixoRepository struct {
	Db *gorm.DB
}

func NewGastoFixoRepository(Db *gorm.DB) *GastoFixoRepository {
	return &GastoFixoRepository{Db: Db}
}

func (r *GastoFixoRepository) GetAll() ([]Entidades.Fixo, error) {
	var fixos []Entidades.Fixo
	resultado := r.Db.Find(&fixos)
	return fixos, resultado.Error
}
func (r *GastoFixoRepository) GetByGastoID(uuid string) (*Entidades.Fixo, error) {
	var fixo Entidades.Fixo
	result := r.Db.Where("gasto_id = ?", uuid).First(&fixo)
	return &fixo, result.Error
}

func (r *GastoFixoRepository) Create(fixo *Entidades.Fixo) error {
	result := r.Db.Create(fixo)
	return result.Error
}

func (r *GastoFixoRepository) Update(fixo *Entidades.Fixo) error {
	result := r.Db.Model(&Entidades.Fixo{}).Where("gasto_id = ?", fixo.GastoID).Update("data_vencimento", fixo.Data_Vencimento)
	return result.Error
}
