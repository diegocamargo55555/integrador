package user_controllers

import (
	user_services "integrador/modulos/user/services"
)

func UserController() string {
	println("oi")
	user_services.CreateUserService()
	return "../controllers/UserController.go"
}
