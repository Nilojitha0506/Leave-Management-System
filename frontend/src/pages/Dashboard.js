import { useEffect, useState, useCallback } from "react";
import { getLeaves } from "../api/leaveApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    loading: true,
    error: null,
  });

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
    load();
  }, []);

  const load = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));
      const data = await getLeaves();
      setStats({
        total: data.length,
        pending: data.filter((l) => l.status === "pending").length,
        approved: data.filter((l) => l.status === "approved").length,
        rejected: data.filter((l) => l.status === "rejected").length,
        loading: false,
        error: null,
      });
    } catch {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load data",
      }));
    }
  };

  const StatCard = ({ title, value, color }) => (
    <div style={getCardStyle(color, screenSize)}>
      <div style={styles.title}>{title}</div>
      <div style={getValueStyle(color, screenSize)}>
        {stats.loading ? "—" : value}
      </div>
    </div>
  );

  const getCardStyle = (color, size) => ({
    padding: size === "mobile" ? "1rem" : size === "tablet" ? "1.25rem" : "1.5rem",
    background: "rgba(255, 255, 255, 0.92)",
    backdropFilter: "blur(12px)",
    borderRadius: size === "mobile" ? "16px" : "20px",
    border: `1px solid ${color}30`,
    boxShadow: `0 8px 24px ${color}20, 0 4px 12px rgba(0,0,0,0.08)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.25rem",
    minHeight: size === "mobile" ? "100px" : size === "tablet" ? "120px" : "140px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  });

  const getValueStyle = (color, size) => ({
    fontSize: size === "mobile" ? "1.5rem" : size === "tablet" ? "2rem" : "2.5rem",
    fontWeight: "800",
    background: `linear-gradient(135deg, ${color} 0%, ${getGradientEnd(color)} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1,
  });

  const getGradientEnd = (color) => {
    const gradients = {
      "#10B981": "#059669",
      "#F59E0B": "#D97706",
      "#EF4444": "#DC2626",
      "#059669": "#047857",
    };
    return gradients[color] || color;
  };

  const getResponsiveStyle = (key, size) => {
    const responsive = {
      container: {
        padding:
          size === "mobile"
            ? "1rem"
            : size === "tablet"
            ? "2rem"
            : "2rem 4rem",
        maxWidth: size === "desktop" ? "1400px" : "100%",
        margin: "0 auto",
        fontFamily: '"Inter", sans-serif',
        background: "linear-gradient(135deg, #F0FDF4 0%, #FEF7C7 50%, #F0FDF4 100%)",
        minHeight: "100vh",
        borderRadius: size === "desktop" ? "32px" : "0",
      },
      header: {
        textAlign: "center",
        marginBottom: size === "mobile" ? "1.5rem" : "3rem",
      },
      mainTitle: {
        fontSize:
          size === "mobile"
            ? "1.75rem"
            : size === "tablet"
            ? "2.25rem"
            : "clamp(2rem, 6vw, 3rem)",
        fontWeight: "800",
        background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #10B981 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: "0 0 0.25rem 0",
      },
      subtitle: {
        color: "#64748B",
        fontSize: size === "mobile" ? "0.95rem" : "1.125rem",
        margin: 0,
      },
      statsGrid: {
        display: "grid",
        gridTemplateColumns:
          size === "mobile"
            ? "1fr"
            : size === "tablet"
            ? "repeat(2, 1fr)"
            : "repeat(auto-fit, minmax(220px, 1fr))",
        gap: size === "mobile" ? "0.5rem" : "1rem",
      },
      loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: size === "mobile" ? "1rem" : "2rem",
        background: "rgba(240, 253, 244, 0.9)",
        borderRadius: "16px",
        border: "2px dashed rgba(16, 185, 129, 0.3)",
        textAlign: "center",
        margin: "2rem auto",
        width: "90%",
        maxWidth: "500px",
      },
      loadingTitle: { fontSize: "1.5rem", fontWeight: "700", color: "#047857", margin: "0 0 0.5rem 0" },
      loadingText: { color: "#64748B", fontSize: "1rem", margin: 0 },
      errorContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "2rem",
        background: "rgba(254, 242, 242, 0.9)",
        borderRadius: "16px",
        border: "2px solid rgba(239, 68, 68, 0.2)",
        textAlign: "center",
        margin: "2rem auto",
        width: "90%",
        maxWidth: "500px",
      },
      errorTitle: { color: "#991B1B", fontSize: "1.5rem", fontWeight: "600", margin: "0 0 1rem 0" },
      retryButton: {
        padding: "12px 24px",
        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "16px",
        fontWeight: "600",
        cursor: "pointer",
      },
    };
    return responsive[key] || {};
  };

  if (stats.loading) {
    return (
      <div style={getResponsiveStyle("loadingContainer", screenSize)}>
        <div style={styles.loadingSpinner} />
        <h2 style={getResponsiveStyle("loadingTitle", screenSize)}>Loading Dashboard</h2>
        <p style={getResponsiveStyle("loadingText", screenSize)}>Fetching leave statistics...</p>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div style={getResponsiveStyle("errorContainer", screenSize)}>
        <h2 style={getResponsiveStyle("errorTitle", screenSize)}>{stats.error}</h2>
        <button onClick={load} style={getResponsiveStyle("retryButton", screenSize)}>🔄 Try Again</button>
      </div>
    );
  }

  return (
    <div style={getResponsiveStyle("container", screenSize)}>
      <div style={getResponsiveStyle("header", screenSize)}>
        <h1 style={getResponsiveStyle("mainTitle", screenSize)}>Dashboard</h1>
        <p style={getResponsiveStyle("subtitle", screenSize)}>Leave management overview</p>
      </div>
      <div style={getResponsiveStyle("statsGrid", screenSize)}>
        <StatCard title="Total Requests" value={stats.total} color="#10B981" />
        <StatCard title="Pending" value={stats.pending} color="#F59E0B" />
        <StatCard title="Approved" value={stats.approved} color="#059669" />
        <StatCard title="Rejected" value={stats.rejected} color="#EF4444" />
      </div>
    </div>
  );
}

const styles = {
  title: {
    fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  loadingSpinner: {
    width: "48px",
    height: "48px",
    border: "3px solid rgba(16, 185, 129, 0.2)",
    borderTop: "3px solid #10B981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1.5rem",
  },
};

