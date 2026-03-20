package routes

import (
	"leave-management/controllers" 

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func SetupRoutes(r *gin.Engine) {
	
	r.Use(cors.Default())

	r.POST("/api/leaves", controllers.CreateLeave) 
	r.POST("/api/employees", controllers.CreateEmployee)

	r.GET("/api/employees", controllers.GetEmployees)
	r.GET("/api/leaves", controllers.GetLeaves)  
	
	r.PUT("/api/leaves/:id", controllers.UpdateLeaveStatus)
}