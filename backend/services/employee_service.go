package services

import (
	"leave-management/models"
	"leave-management/repositories"
)

func CreateEmployee(e *models.Employee) error {
	return repositories.CreateEmployee(e)
}

func GetEmployees() ([]models.Employee, error) {
	return repositories.GetEmployees()
}