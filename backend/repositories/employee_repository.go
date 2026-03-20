package repositories

import (
	"leave-management/config"
	"leave-management/models"
)

func CreateEmployee(e *models.Employee) error {
	return config.DB.QueryRow(
		"INSERT INTO employees (name,email,role) VALUES ($1,$2,$3) RETURNING id",
		e.Name, e.Email, e.Role,
	).Scan(&e.ID)
}

func GetEmployees() ([]models.Employee, error) {
	rows, err := config.DB.Query("SELECT id,name,email,role FROM employees")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Employee
	for rows.Next() {
		var e models.Employee
		rows.Scan(&e.ID, &e.Name, &e.Email, &e.Role)
		list = append(list, e)
	}
	return list, nil
}