package models

type Leave struct {
	ID           int     `json:"id"`
	EmployeeID   int     `json:"employee_id"`
	StartDate    string  `json:"start_date"`
	EndDate      string  `json:"end_date"`
	Type         string  `json:"type"`
	Status       string  `json:"status"`
	Reason       string  `json:"reason"`
	RejectReason *string `json:"reject_reason,omitempty"`
}