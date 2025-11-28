package entities

import "time"

type Categoria struct {
	ID             string  `gorm:"default:uuid_generate_v4()"`
	Nome           string  `json:"name"`
	Valor_Esperado float64 `json:"valor_esperado"`
	Cor            string  `json:"cor"`
	Limite         float64 `json:"limite"`
	UsuarioId      string  `json:"usuario_id" binding:"uuid"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}


