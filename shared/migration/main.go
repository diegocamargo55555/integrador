package main

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Usuario struct {
	ID                   datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome                 string         `gorm:"not null"`
	Senha                string         `gorm:"not null"`
	Max_Val_Planejamento int32          `gorm:"not null"`
	Saldo                float64        `gorm:"default:0"`
	Data_Nascimento      datatypes.Date `gorm:"not null"`
	Email                string         `gorm:"uniqueIndex"`
	Entradas             []Entrada      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Planejamentos        []Planejamento `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Categorias           []Categoria    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Gastos               []Gasto        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt            time.Time
	UpdatedAt            time.Time
}

type Entrada struct {
	ID           datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome         string         `gorm:"not null"`
	Valor        float64        `gorm:"default:0"`
	Data_Entrada datatypes.Date `gorm:"not null"`
	UsuarioId    datatypes.UUID `gorm:"not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
type Planejamento struct {
	ID                     datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome                   string         `gorm:"not null"`
	Valor_Atual            float64        `gorm:"default:0"`
	Valor_Desejado         float64        `gorm:"not null"`
	Estima_Deposito_Mensal float32        `gorm:"not null"`
	Estima_Data_Termino    datatypes.Date `gorm:"not null"`
	CategoriaId            datatypes.UUID `gorm:"not null"`
	UsuarioId              datatypes.UUID `gorm:"not null"`
	CreatedAt              time.Time
	UpdatedAt              time.Time
}

type Categoria struct {
	ID             datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome           string
	Valor_Esperado float64        `gorm:"not null"`
	Cor            string         `gorm:"default:#ffffff"`
	Limite         float64        `gorm:"not null"`
	UsuarioId      datatypes.UUID `gorm:"not null"`
	Planejamentos  []Planejamento `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Gastos         []Gasto        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type Gasto struct {
	ID            datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome          string         `gorm:"not null"`
	Data          datatypes.Date `gorm:"not null"`
	Foi_Pago      bool           `gorm:"not null"`
	Fixo          bool           `goorm:"not null"`
	Valor         float64        `gorm:"default:0"`
	UsuarioId     datatypes.UUID `gorm:"not null"`
	CategoriaId   datatypes.UUID `gorm:"not null"`
	GastoFixos    []Fixo         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	GastoVariados []Variados     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Credito       []Credito      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Pagamento     []Pagamento    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type Fixo struct {
	GastoID         datatypes.UUID `gorm:"not null"`
	Data_Vencimento datatypes.Date `gorm:"not null"`
}
type Variados struct {
	GastoID    datatypes.UUID `gorm:"not null"`
	Data_Gasto datatypes.Date `gorm:"not null"`
}

type Pagamento struct {
	GastoID   datatypes.UUID `gorm:"not null"`
	Tipo      string         `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
type Credito struct {
	GastoID         datatypes.UUID `gorm:"not null"`
	Data_Vencimento datatypes.Date `gorm:"not null"`
}

func main() {
	dsn := "user=postgres.aajsdwzfkgeveslshnms password=braspress413 host=aws-1-us-east-2.pooler.supabase.com port=5432 dbname=postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&Usuario{}, &Entrada{}, &Planejamento{}, &Categoria{}, &Gasto{}, &Fixo{}, &Variados{}, &Pagamento{}, &Credito{})
}
