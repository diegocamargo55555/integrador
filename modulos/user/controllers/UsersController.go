package user_controllers

//https://stackoverflow.com/questions/54867796/how-correctly-to-make-controllers-to-routes-in-golang
import (
	user_services "integrador/modulos/user/services"
)

func UserController() string {
	println("oi")
	user := "ihwa"
	senha := "yeon"
	email := "ihwa@gmail.com"
	user_services.CreateUserService(user, senha, email)
	return "../controllers/UserController.go"
}
