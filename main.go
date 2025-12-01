package main

import (
	routes "integrador/shared/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// func main() {
// 	database.Init()
// 	routes.LoadRoutes()

// 	fmt.Println("Servidor rodando em http://localhost:8080")
// 	err := http.ListenAndServe(":8080", nil)
// 	router "integrador/modulos/categoria/routes"

// 	"github.com/gin-gonic/gin"
// 	"gorm.io/driver/postgres"
// 	"gorm.io/gorm"
// )

func main() {
	dsn := "user=postgres.aajsdwzfkgeveslshnms password=braspress413 host=aws-1-us-east-2.pooler.supabase.com port=5432 dbname=postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.Static("/view", "./view")

	caminho := r.Group("/aginisia")
	routes.LoadRoutes(caminho, db)

	r.Run(":8080")
}