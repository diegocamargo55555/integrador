package user_services

import (
	"context"
	migration "integrador/shared/migration"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func CreateUserService(nome string, email string, senha string) {
	emailExist := false
	if emailExist {
		println("email ja existe")
	}
	print("\n1\n")
	dsn := "user=postgres.aajsdwzfkgeveslshnms password=braspress413 host=aws-1-us-east-2.pooler.supabase.com port=5432 dbname=postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	ctx := context.Background()

	err = gorm.G[migration.Usuario](db).Create(ctx, &migration.Usuario{Nome: nome, Senha: senha, Email: email})
	print("\n2\n")

	println("funcionou")
}
