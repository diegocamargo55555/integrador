package user_routes

import (
	"net/http"
)

func UserController(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../controllers/UserController.go")
}
