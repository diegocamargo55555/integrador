package entities

import "time"

type Gasto struct {
	ID          string  `gorm:"default:uuid_generate_v4()"`
	Nome        string  `json:"name"`
	Mes         int     `json:"mes"`
	Foi_Pago    bool    `json:"foi_pago"`
	Valor       float64 `json:"valor"`
	UsuarioId   string  `json:"usuario_id" binding:"uuid"`
	CategoriaId string  `json:"categoria_id" binding:"uuid"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
