package main

import (
	"fmt"
	"log"
	"net/http"
	routes "integrador/shared/http"
)


func main() {
	routes.LoadRoutes()

	fmt.Println("Servidor rodando em http://localhost:8080")
	// O segundo argumento (nil) informa para usar o roteador padrão
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Erro ao iniciar o servidor: ", err)
	}
}

/*
 mkdir controllers
 mkdir routes
 mkdir services
*/
