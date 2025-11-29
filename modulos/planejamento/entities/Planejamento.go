package planejamento_entities

import (
	"time"

	"gorm.io/datatypes"
)

type Planejamento struct {
	ID                     string         `gorm:"default:uuid_generate_v4()"`
	Nome                   string         `json:"name"`
	Valor_Atual            float64        `json:"valor_atual"`
	Valor_Desejado         float64        `json:"valor_Desejado"`
	Estima_Deposito_Mensal float32        `json:"estima_deposito_mensal"`
	Estima_Data_Termino    datatypes.Date `json:"estima_data_termino"`
	CategoriaId            datatypes.UUID `json:"categoria_id" binding:"uuid"`
	UsuarioId              datatypes.UUID `json:"usuario_id" binding:"uuid"`
	CreatedAt              time.Time
	UpdatedAt              time.Time
}
