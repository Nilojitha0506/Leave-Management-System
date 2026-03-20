import { useEffect, useState, useCallback } from "react";
import { createLeave } from "../api/leaveApi";
import { getEmployees } from "../api/employeeApi";

const LEAVE_TYPES = [
  "Medical Leave",
  "Casual Leave", 
  "Annual Leave",
  "Emergency Leave",
  "Maternity Leave",
  "Paternity Leave",
];

export default function LeaveForm() {
  const [employees, setEmployees] = useState([]);
  const [screenSize, setScreenSize] = useState('desktop');
  const [form, setForm] = useState({
    employee_id: "",
    start_date: "",
    end_date: "",
    type: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) setScreenSize('mobile');
    else if (width < 1024) setScreenSize('tablet');
    else setScreenSize('desktop');
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data || []);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitStatus("");
  };

  const isFutureDate = (dateStr) => {
    const selected = new Date(`${dateStr}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.employee_id || !form.start_date || !form.end_date || !form.type || !form.reason) {
      setModalMessage("Please fill in all fields correctly!");
      setShowModal(true);
      setLoading(false);
      return;
    }

    if (!isFutureDate(form.start_date)) {
      setModalMessage("Start date must be a future date.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      setModalMessage("End date cannot be before start date.");
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      await createLeave({ ...form, employee_id: parseInt(form.employee_id, 10) });
      setModalMessage("Leave request created successfully!");
      setShowModal(true);
      setForm({ employee_id: "", start_date: "", end_date: "", type: "", reason: "" });
    } catch (err) {
      console.error(err);
      setModalMessage("Error creating leave. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const responsiveStyles = {
    container: {
      maxWidth: screenSize === 'mobile' ? '100%' : screenSize === 'tablet' ? '90%' : '600px',
      margin: '0 auto',
      padding: screenSize === 'mobile' ? '1.5rem 1rem' : screenSize === 'tablet' ? '2rem 1.5rem' : '2.5rem',
      background: "linear-gradient(135deg, #F0FDF4 0%, #FEFCE8 50%, #F0FDF4 100%)",
      borderRadius: screenSize === 'mobile' ? '20px' : '32px',
      boxShadow: "0 25px 50px -12px rgba(16,185,129,0.25), 0 10px 20px -8px rgba(245,158,11,0.15)",
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    },
    header: { textAlign: 'center', marginBottom: screenSize === 'mobile' ? '1.5rem' : '2.5rem' },
    title: { fontSize: screenSize === 'mobile' ? '1.5rem' : '1.75rem', fontWeight: 800, color: "#10B981" },
    form: { display: "grid", gap: screenSize === 'mobile' ? '1.5rem' : '2rem' },
    fieldGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
    label: { fontSize: screenSize === 'mobile' ? '0.8rem' : '0.875rem', fontWeight: 600, color: "#047857" },
    select: { padding: screenSize === 'mobile' ? '14px' : '16px', borderRadius: '16px', border: '2px solid #D1D5DB', fontSize: '16px' },
    dateInput: { padding: screenSize === 'mobile' ? '14px' : '16px', borderRadius: '16px', border: '2px solid #D1D5DB' },
    textarea: { padding: screenSize === 'mobile' ? '14px' : '16px', borderRadius: '16px', border: '2px solid #D1D5DB', minHeight: screenSize === 'mobile' ? '100px' : '120px' },
    submitButton: { padding: screenSize === 'mobile' ? '16px' : '20px', borderRadius: '24px', fontSize: screenSize === 'mobile' ? '16px' : '18px', background: "#10B981", color: "#fff", fontWeight: 700, border: 'none', cursor: 'pointer' }
  };

  return (
    <>
      <div style={responsiveStyles.container}>
        <div style={responsiveStyles.header}>
          <h2 style={responsiveStyles.title}>Apply for Leave</h2>
        </div>

        <form onSubmit={handleSubmit} style={responsiveStyles.form}>
          <div style={responsiveStyles.fieldGroup}>
            <label style={responsiveStyles.label}>Select Employee</label>
            <select name="employee_id" value={form.employee_id} onChange={handleChange} required disabled={loading} style={responsiveStyles.select}>
              <option value="">Choose an employee...</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>)}
            </select>
          </div>

          <div style={responsiveStyles.fieldGroup}>
            <label style={responsiveStyles.label}>Leave Type</label>
            <select name="type" value={form.type} onChange={handleChange} required disabled={loading} style={responsiveStyles.select}>
              <option value="">Select leave type...</option>
              {LEAVE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: screenSize === 'mobile' ? '1fr' : '1fr 1fr', gap: screenSize === 'mobile' ? '1rem' : '1.5rem' }}>
            <div style={responsiveStyles.fieldGroup}>
              <label style={responsiveStyles.label}>Start Date</label>
              <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required disabled={loading} style={responsiveStyles.dateInput} />
            </div>
            <div style={responsiveStyles.fieldGroup}>
              <label style={responsiveStyles.label}>End Date</label>
              <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required disabled={loading} style={responsiveStyles.dateInput} />
            </div>
          </div>

          <div style={responsiveStyles.fieldGroup}>
            <label style={responsiveStyles.label}>Reason for Leave</label>
            <textarea name="reason" value={form.reason} onChange={handleChange} required disabled={loading} style={responsiveStyles.textarea} />
          </div>

          <button type="submit" disabled={loading} style={responsiveStyles.submitButton}>
            {loading ? "Processing..." : "Apply Leave"}
          </button>
        </form>
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "20px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
            <p style={{ marginBottom: "1.5rem", fontWeight: 500 }}>{modalMessage}</p>
            <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", borderRadius: "12px", border: "none", background: "#10B981", color: "#fff", cursor: "pointer" }}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}