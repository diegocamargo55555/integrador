package migration

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Usuario struct {
	ID   datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome string         `gorm:"not null"`
	//Name       string `gorm:"size:100;not null"`
	Senha                string `gorm:"not null"`
	Max_Val_Planejamento int32
	Saldo                float64 `gorm:"default:0"`
	Data_Nascimento      datatypes.Date
	Email                string `gorm:"uniqueIndex";not null`
	Entradas             []Entrada
	Planejamentos        []Planejamento
	Categorias           []Categoria
	Gastos               []Gasto
	CreatedAt            time.Time
	UpdatedAt            time.Time
}

type Entrada struct {
	ID           datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome         string
	Valor        float64 `gorm:"default:0"`
	Data_Entrada datatypes.Date
	UsuarioId    datatypes.UUID
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
type Planejamento struct {
	ID                     datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome                   string
	Valor_Atual            float64 `gorm:"default:0"`
	Valor_Desejado         float64
	Estima_Deposito_Mensal float32
	Estima_Data_Termino    datatypes.Date
	CategoriaId            datatypes.UUID
	UsuarioId              datatypes.UUID
	CreatedAt              time.Time
	UpdatedAt              time.Time
}

type Categoria struct {
	ID             datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome           string
	Valor_Esperado float64
	Cor            string `gorm:"default:#ffffff"`
	Limite         float64
	UsuarioId      datatypes.UUID
	Planejamentos  []Planejamento
	Gastos         []Gasto
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type Gasto struct {
	ID          datatypes.UUID `gorm:"default:uuid_generate_v4()"`
	Nome        string
	Mes         int
	Foi_Pago    bool
	Valor       float64 `gorm:"default:0"`
	UsuarioId   datatypes.UUID
	CategoriaId datatypes.UUID
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Fixo struct {
	GastoID         datatypes.UUID
	Data_Vencimento datatypes.Date
}
type Variados struct {
	GastoID    datatypes.UUID
	Data_Gasto datatypes.Date
}

type Pagamento struct {
	GastoID   datatypes.UUID
	Tipo      string
	CreatedAt time.Time
	UpdatedAt time.Time
}
type Credito struct {
	GastoID         datatypes.UUID
	Data_Vencimento datatypes.Date
}

func executemigration() {
	dsn := "user=postgres.aajsdwzfkgeveslshnms password=braspress413 host=aws-1-us-east-2.pooler.supabase.com port=5432 dbname=postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&Usuario{}, &Entrada{}, &Planejamento{}, &Categoria{}, &Gasto{}, &Fixo{}, &Variados{}, &Pagamento{}, &Credito{})
}
