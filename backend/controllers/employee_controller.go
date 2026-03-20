package controllers

import (
	"net/http"
	"leave-management/models"
	"leave-management/services"

	"github.com/gin-gonic/gin"
)

func CreateEmployee(c *gin.Context) {
	var e models.Employee

	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	services.CreateEmployee(&e)
	c.JSON(http.StatusOK, e)
}

func GetEmployees(c *gin.Context) {
	data, _ := services.GetEmployees()
	c.JSON(http.StatusOK, data)
}