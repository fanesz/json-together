package utils

import (
	"math/rand"
	"time"
)

func RandomString(length int) string {
	rand.Seed(time.Now().UnixNano())
	chars := "0123456789abcdefghijklmnopqrstuvwxyz"
	code := make([]byte, length)
	for i := 0; i < length; i++ {
		code[i] = chars[rand.Intn(len(chars))]
	}
	return string(code)
}
