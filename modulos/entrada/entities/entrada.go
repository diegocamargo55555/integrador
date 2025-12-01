package entrada_entities

import (
	"time"

	"gorm.io/datatypes"
)

type Entrada struct {
	ID           string         `gorm:"default:uuid_generate_v4()"`
	Nome         string         `json:"name"`
	Valor        float64        `json:"valor"`
	Data_Entrada datatypes.Date `json:"data_entrada"`
	UsuarioId    string         `json:"usuario_id" binding:"uuid"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
