package user_routes

import (
	user_controllers "integrador/modulos/user/controllers"
	"net/http"
)

func UserRoute(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		user_controllers.ListUsersController(w, r)
	case "POST":
		user_controllers.CreateUserController(w, r)
	default:
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}
