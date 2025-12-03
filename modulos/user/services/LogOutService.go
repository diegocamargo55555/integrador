package user_services

// import (
// 	"errors"
// 	"integrador/shared/auth"
// 	"time"

// 	"github.com/golang-jwt/jwt/v4"
// )

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour), //Sets the expiry time an hour ago in the past.
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})

}
