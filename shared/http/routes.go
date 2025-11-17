package routes

import (
	user_routes "integrador/modulos/user/routes"
	"net/http"
)

func LoadRoutes() {
	http.HandleFunc("/main_page", ServeMainPage)
	http.HandleFunc("/user", user_routes.UserController)

}

func ServeMainPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "view/main_page/main_page.html")
}
