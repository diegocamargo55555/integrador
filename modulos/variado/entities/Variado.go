package entities

type Variado struct {
	GastoID    string `json:"gasto_id" validate:"uuid"`
	Data_Gasto string `json:"data_gasto"`
}
