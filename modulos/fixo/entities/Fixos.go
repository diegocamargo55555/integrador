package entities

type Fixo struct {
	GastoID         string `json:"gasto_id" validate:"uuid"`
	Data_Vencimento string `json:"data_vencimento"`
}
