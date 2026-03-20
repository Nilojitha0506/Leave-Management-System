import { useEffect, useState, useCallback } from "react";
import { createEmployee } from "../api/employeeApi";

export default function EmployeeForm({ onSuccess }) {
  const [screenSize, setScreenSize] = useState("desktop");
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) setScreenSize("mobile");
    else if (width < 1024) setScreenSize("tablet");
    else setScreenSize("desktop");
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name || !form.email || !form.role) {
      setModalMessage("Please fill in all fields.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      await createEmployee(form);
      setSubmitStatus("success");
      setForm({ name: "", email: "", role: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg =
        err.response?.status === 409
          ? "This email already exists!"
          : "Something went wrong.";
      setModalMessage(msg);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: screenSize === "mobile" ? "100%" : "600px",
      margin: "0 auto",
      padding: screenSize === "mobile" ? "1.5rem 1rem" : screenSize === "tablet" ? "2rem 1.5rem" : "2.5rem",
      background: "linear-gradient(135deg, #F0FDF4 0%, #FEFCE8 50%, #F0FDF4 100%)",
      borderRadius: screenSize === "mobile" ? "20px" : "32px",
      boxShadow:
        "0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 10px 20px -8px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(16, 185, 129, 0.15)",
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    },
    header: {
      textAlign: "center",
      marginBottom: screenSize === "mobile" ? "1.5rem" : "2.5rem",
    },
    title: {
      fontSize:
        screenSize === "mobile"
          ? "1.5rem"
          : screenSize === "tablet"
          ? "1.75rem"
          : "clamp(1.75rem, 5vw, 2.5rem)",
      fontWeight: 800,
      background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #10B981 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: "0 0 0.5rem 0",
      letterSpacing: "-0.025em",
    },
    form: { display: "grid", gap: screenSize === "mobile" ? "1.5rem" : "2rem" },
    input: {
      padding: screenSize === "mobile" ? "14px 16px" : "16px 20px",
      borderRadius: "16px",
      border: "2px solid #D1D5DB",
      fontSize: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    },
    button: {
      padding: screenSize === "mobile" ? "16px 24px" : "20px 32px",
      borderRadius: screenSize === "mobile" ? "20px" : "24px",
      background: "#10B981",
      color: "#fff",
      border: "none",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: screenSize === "mobile" ? "16px" : "18px",
      boxShadow:
        "0 12px 24px rgba(16,185,129,0.3), 0 6px 12px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
    },
    statusMessage: {
      padding: "12px",
      borderRadius: "16px",
      fontWeight: 500,
      fontSize: screenSize === "mobile" ? "0.9rem" : "0.95rem",
      color: "#065F46",
      background: "rgba(16,185,129,0.1)",
      textAlign: "center",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Employee</h2>
        </div>

        {submitStatus === "success" && <div style={styles.statusMessage}>Employee added successfully!</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Processing..." : "Add Employee"}
          </button>
        </form>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "10px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #F0FDF4 0%, #FEFCE8 100%)",
              borderRadius: "20px",
              padding: screenSize === "mobile" ? "1.5rem" : "2rem",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              boxShadow:
                "0 12px 24px rgba(16,185,129,0.3), 0 6px 12px rgba(245,158,11,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#EF4444" }}>⚠️ Notice</h3>
            <p style={{ marginBottom: "1.5rem" }}>{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                border: "none",
                background: "#10B981",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}