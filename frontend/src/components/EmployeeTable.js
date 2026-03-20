import React, { useEffect, useState } from "react";
import EmployeeForm from "./EmployeeForm";
import { getEmployees } from "../api/employeeApi";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [screenSize, setScreenSize] = useState("desktop");
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const containerStyle = {
    padding: screenSize === "mobile" ? "12px 8px" : screenSize === "tablet" ? "18px 15px" : "24px 20px",
    width: "100%",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: screenSize === "mobile" ? "flex-start" : "center",
    flexDirection: screenSize === "mobile" ? "column" : "row",
    gap: "12px",
    marginBottom: "16px",
  };

  const titleStyle = {
    fontSize: screenSize === "mobile" ? "1.25rem" : screenSize === "tablet" ? "1.5rem" : "1.75rem",
    fontWeight: 800,
    color: "#065F46",
    margin: 0
  };

  const addButtonStyle = {
    padding: screenSize === "mobile" ? "10px 16px" : "14px 20px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "linear-gradient(135deg, #10B981, #059669)",
    color: "#fff",
    fontSize: screenSize === "mobile" ? "14px" : "16px",
  };

  const cardGridStyle = {
    display: "grid",
    gridTemplateColumns:
      screenSize === "mobile"
        ? "1fr"
        : screenSize === "tablet"
        ? "repeat(2, 1fr)"
        : "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "20px",
    padding: screenSize === "mobile" ? "12px" : "16px",
    boxShadow: "0 12px 24px rgba(16,185,129,0.1), 0 6px 12px rgba(245,158,11,0.1)",
    transition: "transform 0.2s",
  };

  const emptyStateStyle = {
    margin: "20px auto",
    padding: "20px",
    textAlign: "center",
    border: "2px dashed #10B981",
    borderRadius: "16px",
    maxWidth: "400px",
    color: "#065F46",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Employee Directory</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={addButtonStyle}
        >
          {showForm ? "Close Form" : "+ Add Employee"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "20px" }}>
          <EmployeeForm
            onSuccess={() => {
              fetchEmployees();
              setShowForm(false); 
            }}
          />
        </div>
      )}

      {employees.length === 0 && (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>👥</div>
          <h3>No employees found</h3>
          <p style={{ fontSize: "14px", color: "#059669" }}>
            Add employees to get started.
          </p>
        </div>
      )}

      {employees.length > 0 && (
        <>
          <div style={cardGridStyle}>
            {employees.map((emp) => {
              const isManager = emp.role?.toLowerCase() === "manager";
              return (
                <div
                  key={emp.id}
                  style={cardStyle}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span>ID: {emp.id}</span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                        backgroundColor: isManager ? "#10B981" : "#F59E0B",
                      }}
                    >
                      {emp.role}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "16px" }}>{emp.name}</div>
                  <div style={{ fontSize: "13px", color: "#065F46" }}>{emp.email}</div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "16px",
              textAlign: "center",
              fontSize: "14px",
              color: "#047857",
            }}
          >
            Showing <strong>{employees.length}</strong> employees
          </div>
        </>
      )}
    </div>
  );
}