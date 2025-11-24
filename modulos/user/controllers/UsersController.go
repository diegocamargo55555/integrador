package user_controllers

import (
	"encoding/json"
	"net/http"

	user_services "integrador/modulos/user/services"
	database "integrador/shared"
)

type CreateUserRequest struct {
	Nome  string `json:"nome"`
	Email string `json:"email"`
	Senha string `json:"senha"`
}

func CreateUserController(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	db := database.GetDB()
	usuario, err := user_services.CreateUserService(db, req.Nome, req.Email, req.Senha)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(usuario)
}

func ListUsersController(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()

	usuarios, err := user_services.ListUserService(db)
	if err != nil {
		http.Error(w, "Erro ao buscar usuários", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usuarios)
}
