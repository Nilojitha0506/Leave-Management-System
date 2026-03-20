package repositories

import (
	"database/sql"
	"errors"
	"leave-management/config"
	"leave-management/models"
)

func CreateLeave(l *models.Leave) error {
	query := `
		INSERT INTO leaves (employee_id, start_date, end_date, type, status, reason, reject_reason)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`

	var rejectReason any = nil
	if l.RejectReason != nil {
		rejectReason = *l.RejectReason
	}

	return config.DB.QueryRow(
		query,
		l.EmployeeID,
		l.StartDate,
		l.EndDate,
		l.Type,
		l.Status,
		l.Reason,
		rejectReason,
	).Scan(&l.ID)
}

func GetLeaves() ([]models.Leave, error) {
	rows, err := config.DB.Query(`
		SELECT id, employee_id, start_date, end_date, type, status, reason, reject_reason
		FROM leaves
		ORDER BY id DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var leaves []models.Leave

	for rows.Next() {
		var l models.Leave
		var rejectReason sql.NullString

		if err := rows.Scan(
			&l.ID,
			&l.EmployeeID,
			&l.StartDate,
			&l.EndDate,
			&l.Type,
			&l.Status,
			&l.Reason,
			&rejectReason,
		); err != nil {
			return nil, err
		}

		if rejectReason.Valid {
			r := rejectReason.String
			l.RejectReason = &r
		}

		leaves = append(leaves, l)
	}

	if leaves == nil {
		leaves = []models.Leave{}
	}

	return leaves, nil
}

func UpdateLeaveStatus(id int, status string, rejectReason string) error {
	var query string
	var args []any

	if status == "approved" {
		query = `
			UPDATE leaves
			SET status = $1, reject_reason = NULL
			WHERE id = $2 AND status = 'pending'
		`
		args = []any{status, id}
	} else {
		query = `
			UPDATE leaves
			SET status = $1, reject_reason = $2
			WHERE id = $3 AND status = 'pending'
		`
		args = []any{status, rejectReason, id}
	}

	res, err := config.DB.Exec(query, args...)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("leave already processed or not found")
	}

	return nil
}