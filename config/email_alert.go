package main

import (
	gomail "gopkg.in/gomail.v2"
)

func main() {

	msg := gomail.NewMessage()
	msg.SetHeader("From", "digocraft001@gmail.com")
	msg.SetHeader("To", "anabeatriz.sureke@gmail.com")
	msg.SetHeader("Subject", "Test Email from Go")
	msg.SetBody("text/html", "<b>This is the body of the mail</b>")

	n := gomail.NewDialer("smtp.gmail.com", 587, "digocraft001@gmail.com", "fuhq gzcq kxca eshn")

	if err := n.DialAndSend(msg); err != nil {
		println("deu errado ")
		panic(err)
	}

	println("Email enviado com sucesso!") // Success message
}
