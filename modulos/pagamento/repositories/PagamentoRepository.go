package repositories

import (
	Entidades "integrador/modulos/pagamento/entities"

	"gorm.io/gorm"
)

type PagamentoRepository struct {
	Db *gorm.DB
}

func NewPagamentoRepository(Db *gorm.DB) *PagamentoRepository {
	return &PagamentoRepository{Db: Db}
}

func (r *PagamentoRepository) GetAll() ([]Entidades.Pagamento, error) {
	var categorias []Entidades.Pagamento
	resultado := r.Db.Find(&categorias)
	return categorias, resultado.Error
}
func (r *PagamentoRepository) GetByID(uuid string) (*Entidades.Pagamento, error) {
	var categoria Entidades.Pagamento
	result := r.Db.Where("gasto_id = ?", uuid).First(&categoria)
	return &categoria, result.Error
}

func (r *PagamentoRepository) Create(pagamento *Entidades.Pagamento) error {
	result := r.Db.Create(pagamento)
	return result.Error
}

func (r *PagamentoRepository) Update(pagamento *Entidades.Pagamento) error {
	result := r.Db.Model(&Entidades.Pagamento{}).Where("gasto_id = ?", pagamento.GastoID).Update("tipo", pagamento.Tipo)
	return result.Error
}
func (r *PagamentoRepository) Delete(uuid string) error {
	result := r.Db.Where("gasto_id = ?", uuid).Delete(&Entidades.Pagamento{})
	return result.Error
}
