import { useEffect, useState, useCallback } from "react";
import { getLeaves, updateLeaveStatus } from "../api/leaveApi";

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [screenSize, setScreenSize] = useState("desktop");

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

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await getLeaves();
      setLeaves(data || []);
    } catch (err) {
      console.error("Failed to load leaves", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'approve' }));
    try {
      await updateLeaveStatus(id, "approved");
      loadLeaves();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve leave");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason || !reason.trim()) return;

    setActionLoading(prev => ({ ...prev, [id]: 'reject' }));
    try {
      await updateLeaveStatus(id, "rejected", reason.trim());
      loadLeaves();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject leave");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <h2 style={styles.loadingTitle}>Loading Leave Requests</h2>
        <p style={styles.loadingText}>Fetching pending approvals...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Leave Approval</h1>
        <p style={styles.subtitle}>Review and manage employee leave requests</p>
      </div>

      {leaves.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>No leave requests</h3>
          <p style={styles.emptyText}>All leave requests have been processed</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: screenSize === "mobile" ? "800px" : "100%" }}>
            <div style={styles.tableHeader}>
              <div style={styles.th}>ID</div>
              <div style={styles.th}>Employee</div>
              <div style={styles.th}>Type</div>
              <div style={styles.th}>Dates</div>
              <div style={styles.th}>Reason</div>
              <div style={styles.th}>Status</div>
              <div style={styles.th}>Reject Reason</div>
              <div style={styles.th}>Action</div>
            </div>

            {leaves.map((leave) => (
              <div key={leave.id} style={styles.tableRow}>
                <div style={styles.td}>{leave.id}</div>
                <div style={styles.td}>{leave.employee_id}</div>
                <div style={styles.td}>{leave.type}</div>
                <div style={styles.td}>
                  <span style={styles.dateRange}>
                    {new Date(leave.start_date).toLocaleDateString()}{" "}
                    <span style={styles.dateArrow}>→</span>{" "}
                    {new Date(leave.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.td} title={leave.reason}>
                  {leave.reason.length > 30 ? `${leave.reason.substring(0, 30)}...` : leave.reason}
                </div>
                <div style={styles.td}>
                  <span style={getStatusBadgeStyle(leave.status)}>{leave.status}</span>
                </div>
                <div style={styles.td}>
                  {leave.reject_reason ? (
                    <span style={styles.rejectReason} title={leave.reject_reason}>
                      {leave.reject_reason.length > 25
                        ? `${leave.reject_reason.substring(0, 25)}...`
                        : leave.reject_reason}
                    </span>
                  ) : "-"}
                </div>
                <div style={styles.td}>
                  {leave.status === "pending" ? (
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleApprove(leave.id)}
                        disabled={actionLoading[leave.id] === 'approve'}
                        style={{
                          ...styles.approveBtn,
                          opacity: actionLoading[leave.id] === 'approve' ? 0.7 : 1,
                          cursor: actionLoading[leave.id] === 'approve' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {actionLoading[leave.id] === 'approve' ? ' Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(leave.id)}
                        disabled={actionLoading[leave.id] === 'reject'}
                        style={{
                          ...styles.rejectBtn,
                          opacity: actionLoading[leave.id] === 'reject' ? 0.7 : 1,
                          cursor: actionLoading[leave.id] === 'reject' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {actionLoading[leave.id] === 'reject' ? ' Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  ) : (
                    <span style={styles.finalized}>✓ Finalized</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const getStatusBadgeStyle = (status) => ({
  ...styles.statusBadge,
  background:
    status === 'pending'
      ? 'linear-gradient(135deg, #F59E0B, #D97706)'
      : status === 'approved'
      ? 'linear-gradient(135deg, #10B981, #059669)'
      : 'linear-gradient(135deg, #EF4444, #DC2626)',
  color: '#fff'
});

const styles = {
  container: {
    padding: "2rem 1rem",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily: '"Inter", sans-serif',
    background: "linear-gradient(135deg, #F0FDF4 0%, #FEF7C7 50%, #F0FDF4 100%)",
    borderRadius: "16px",
  },
  header: { textAlign: "center", marginBottom: "3rem" },
  mainTitle: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: 800,
    background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #10B981 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 0.5rem 0",
    lineHeight: 1.1,
  },
  subtitle: { color: "#64748B", fontSize: "clamp(1rem,3vw,1.25rem)", margin: 0 },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "60px 80px 1fr 180px 2fr 120px 180px 200px",
    background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(245,158,11,0.08))",
    fontWeight: 700,
    color: "#047857",
    borderBottom: "2px solid rgba(16,185,129,0.2)",
    padding: "1rem",
  },
  th: { padding: "1rem", textTransform: "uppercase", fontSize: "0.875rem" },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "60px 80px 1fr 180px 2fr 120px 180px 200px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    padding: "1rem 0",
    alignItems: "center"
  },
  td: { padding: "0.5rem 1rem", fontSize: "0.875rem", display: "flex", alignItems: "center" },
  dateRange: { fontWeight: 500, color: "#059669" },
  dateArrow: { margin: "0 0.5rem", fontWeight: 700, color: "#F59E0B" },
  statusBadge: { padding: "0.25rem 0.5rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" },
  rejectReason: { color: "#991B1B", fontStyle: "italic", background: "rgba(239,68,68,0.1)", padding: "0.25rem 0.5rem", borderRadius: "8px", fontSize: "0.75rem" },
  actionButtons: { display: "flex", gap: "0.5rem" },
  approveBtn: { padding: "0.5rem 1rem", background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", borderRadius: "12px", border: "none", fontWeight: 600, cursor: "pointer" },
  rejectBtn: { padding: "0.5rem 1rem", background: "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", borderRadius: "12px", border: "none", fontWeight: 600, cursor: "pointer" },
  finalized: { color: "#10B981", fontWeight: 600 },
  emptyState: { textAlign: "center", padding: "3rem 1rem", borderRadius: "16px", border: "2px dashed rgba(16,185,129,0.3)", background: "rgba(255,255,255,0.8)", margin: "2rem 0" },
  emptyTitle: { fontSize: "1.5rem", fontWeight: 700, color: "#047857" },
  emptyText: { fontSize: "1rem", color: "#64748B" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", textAlign: "center" },
  loadingSpinner: { width: "48px", height: "48px", border: "3px solid rgba(16,185,129,0.2)", borderTop: "3px solid #10B981", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "1rem" },
  loadingTitle: { fontSize: "1.5rem", fontWeight: 700, color: "#047857" },
  loadingText: { fontSize: "1rem", color: "#64748B" }
};