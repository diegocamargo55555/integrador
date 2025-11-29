package entities

import "time"

type Pagamento struct {
	GastoID   string `json:"gasto_id" validate:"uuid"`
	Tipo      string `json:"tipo"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
