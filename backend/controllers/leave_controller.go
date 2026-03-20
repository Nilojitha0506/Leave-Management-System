package controllers

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"leave-management/models"
	"leave-management/services"

	"github.com/gin-gonic/gin"
)

var allowedLeaveTypes = map[string]bool{
	"Medical Leave":        true,
	"Casual Leave":         true,
	"Annual Leave":         true,
	"Emergency Leave":      true,
	"Maternity Leave":      true,
	"Paternity Leave":      true,
}

func CreateLeave(c *gin.Context) {
	var l models.Leave

	if err := c.ShouldBindJSON(&l); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if l.EmployeeID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee_id is required"})
		return
	}

	if strings.TrimSpace(l.Type) == "" || !allowedLeaveTypes[l.Type] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid leave type"})
		return
	}

	if strings.TrimSpace(l.Reason) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason is required"})
		return
	}

	startDate, err := time.Parse("2006-01-02", l.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start_date format"})
		return
	}

	endDate, err := time.Parse("2006-01-02", l.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end_date format"})
		return
	}

	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	if !startDate.After(today) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date must be in the future"})
		return
	}

	if endDate.Before(startDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "end_date must be after or equal to start_date"})
		return
	}

	l.Status = "pending"
	l.RejectReason = nil

	log.Printf("Received leave data: %+v\n", l)

	if err := services.CreateLeave(&l); err != nil {
		log.Println("Error creating leave:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create leave"})
		return
	}

	c.JSON(http.StatusCreated, l)
}

func GetLeaves(c *gin.Context) {
	leaves, err := services.GetLeaves()
	if err != nil {
		log.Println("Error fetching leaves:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaves"})
		return
	}

	c.JSON(http.StatusOK, leaves)
}

func UpdateLeaveStatus(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid leave id"})
		return
	}

	var body struct {
		Status       string `json:"status"`
		RejectReason string `json:"reject_reason,omitempty"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.Status != "approved" && body.Status != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
		return
	}

	if body.Status == "rejected" && strings.TrimSpace(body.RejectReason) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reject_reason is required when rejecting"})
		return
	}

	if err := services.UpdateLeaveStatus(id, body.Status, body.RejectReason); err != nil {
		log.Println("Error updating leave:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave updated successfully"})
}