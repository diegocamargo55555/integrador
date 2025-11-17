package user_routes

import (
	"net/http"
	user_controllers "integrador/modulos/user/controllers"

)

func UserRoute(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, user_controllers.UserController())
}
