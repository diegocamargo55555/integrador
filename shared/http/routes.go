package routes

import (
	user_routes "integrador/modulos/user/routes"
	"net/http"
	gastos_routes "integrador/modulos/categoria/routes"
)

func LoadRoutes() {
	http.HandleFunc("/aginisia/categoria", gastos_routes.BookRouter())

}

func ServeMainPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "view/main_page/main_page.html")
}
