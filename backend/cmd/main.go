package main

import (
	"log"

	"leave-management/config"
	"leave-management/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config.ConnectDB()

	r := gin.Default()
	r.Use(cors.Default())

	routes.SetupRoutes(r)

	r.Run(":8080")
}