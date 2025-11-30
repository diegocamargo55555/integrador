package repositories

import (
	Entidades "integrador/modulos/credito/entities"

	"gorm.io/gorm"
)

type CreditoRepository struct {
	Db *gorm.DB
}

func NewCreditoRepository(Db *gorm.DB) *CreditoRepository {
	return &CreditoRepository{Db: Db}
}

func (r *CreditoRepository) GetAll() ([]Entidades.Credito, error) {
	var credito []Entidades.Credito
	resultado := r.Db.Find(&credito)
	return credito, resultado.Error
}
func (r *CreditoRepository) GetByGastoID(uuid string) (*Entidades.Credito, error) {
	var credito Entidades.Credito
	result := r.Db.Where("gasto_id = ?", uuid).First(&credito)
	print(result)
	return &credito, result.Error
}

func (r *CreditoRepository) Create(fixo *Entidades.Credito) error {
	result := r.Db.Create(fixo)
	return result.Error
}

func (r *CreditoRepository) Update(fixo *Entidades.Credito) error {
	result := r.Db.Model(&Entidades.Credito{}).Where("gasto_id = ?", fixo.GastoID).Update("data_vencimento", fixo.Data_Vencimento)
	return result.Error
}

func (r *CreditoRepository) Delete(uuid string) error {
	result := r.Db.Where("gasto_id = ?", uuid).Delete(&Entidades.Credito{})
	return result.Error
}
