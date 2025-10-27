package main

import (
	"fmt"
	"log"
	"net/http"
)

func handlerRaiz(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Bem-vindo ao servidor Go!")
}

func handlerOla(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Olá, visitante!")
}

func main() {
	// 1. Configurando as rotas
	// http.HandleFunc registra uma função manipuladora para um padrão de URL.
	// Quando alguém acessar "/", chame a função handlerRaiz
	http.HandleFunc("/", handlerRaiz)

	// Quando alguém acessar "/ola", chame a função handlerOla
	http.HandleFunc("/ola", handlerOla)

	// 2. Iniciando o servidor
	fmt.Println("Servidor rodando em http://localhost:8080")

	// O segundo argumento (nil) informa para usar o roteador padrão
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Erro ao iniciar o servidor: ", err)
	}
}
