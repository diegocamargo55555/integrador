package user_entities

import (
	"time"

)

type Usuario struct {
	ID                   string         `gorm:"default:uuid_generate_v4()"`
	Nome                 string         `json:"name"`
	Senha                string         `json:"senha"`
	Max_Val_Planejamento int32          `json:"max_val_planejamento"`
	Saldo                float64        `json:"limite"`
	Email                string         `json:"email"`
	CreatedAt            time.Time
	UpdatedAt            time.Time
}
