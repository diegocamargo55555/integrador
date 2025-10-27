package routes

import (
	"net/http"
)

func LoadRoutes() {
	http.HandleFunc("/main_page", ServeMainPage)
}

func ServeMainPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "view/main_page/main_page.html")
}
