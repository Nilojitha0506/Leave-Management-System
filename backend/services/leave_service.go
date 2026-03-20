package services

import (
	"leave-management/models"
	"leave-management/repositories"
)

func CreateLeave(l *models.Leave) error {
	return repositories.CreateLeave(l)
}

func GetLeaves() ([]models.Leave, error) {
	return repositories.GetLeaves()
}

func UpdateLeaveStatus(id int, status string, rejectReason string) error {
	return repositories.UpdateLeaveStatus(id, status, rejectReason)
}