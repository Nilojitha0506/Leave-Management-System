import React, { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  const [screenSize, setScreenSize] = useState("desktop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", title: "Dashboard", label: "Dashboard" },
    { href: "/employees", title: "Employees", label: "Employees" },
    { href: "/requests", title: "Leave Requests", label: "Leave Requests" },
    { href: "/approval", title: "Leaves Approval", label: "Leaves Approval" },
  ];

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) setScreenSize("mobile");
    else if (width < 1024) setScreenSize("tablet");
    else setScreenSize("desktop");
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const styles = {
    navbar: {
      display: "flex",
      flexDirection: screenSize === "mobile" ? "column" : "row",
      alignItems: screenSize === "mobile" ? "flex-start" : "center",
      justifyContent: "space-between",
      padding:
        screenSize === "mobile"
          ? "0.75rem 1rem"
          : screenSize === "tablet"
          ? "1rem 2rem"
          : "1.25rem 3rem",
      background:
        "linear-gradient(135deg, rgba(240, 253, 244, 0.98) 0%, rgba(254, 247, 199, 0.95) 50%, rgba(240, 253, 244, 0.98) 100%)",
      backdropFilter: "blur(20px)",
      borderBottom:
        screenSize === "mobile" ? "none" : "1px solid rgba(16, 185, 129, 0.2)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      gap: screenSize === "mobile" ? "0.5rem" : 0,
      fontFamily: '"Inter", sans-serif',
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      cursor: "pointer",
      padding: "0.5rem 1rem",
      borderRadius: "16px",
      background:
        "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)",
      border: "1px solid rgba(16, 185, 129, 0.2)",
      transition: "all 0.3s ease",
    },
    logoTitle: {
      fontSize:
        screenSize === "mobile"
          ? "1.5rem"
          : screenSize === "tablet"
          ? "1.75rem"
          : "2rem",
      fontWeight: 800,
      background: "linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #10B981 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      margin: 0,
      lineHeight: 1.1,
    },
    hamburger: {
      display: screenSize === "mobile" ? "flex" : "none",
      flexDirection: "column",
      cursor: "pointer",
      padding: "10px",
      borderRadius: "12px",
      background: "rgba(16, 185, 129, 0.1)",
      border: "1px solid rgba(16, 185, 129, 0.2)",
      gap: "4px",
      alignSelf: "flex-end",
    },
    hamburgerLine: {
      width: "24px",
      height: "3px",
      background: "#065F46",
      borderRadius: "2px",
      transition: "all 0.3s ease",
    },
    navLinks: {
      display: "flex",
      flexDirection: screenSize === "mobile" ? "column" : "row",
      gap: screenSize === "mobile" ? "0.5rem" : "1.5rem",
      alignItems: "center",
      width: screenSize === "mobile" ? "100%" : "auto",
      maxHeight: screenSize === "mobile" ? (isMenuOpen ? "500px" : "0") : "auto",
      overflow: "hidden",
      transition: "max-height 0.3s ease",
    },
    navLink: {
      display: "block",
      padding: screenSize === "mobile" ? "0.75rem" : "0.5rem 1rem",
      color: "#047857",
      textDecoration: "none",
      fontWeight: 600,
      fontSize: screenSize === "mobile" ? "1.1rem" : "0.95rem",
      borderRadius: "8px",
      textAlign: screenSize === "mobile" ? "center" : "left",
      transition: "background 0.2s ease",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoSection} onClick={closeMenu}>
        <h1 style={styles.logoTitle}>Leave Management</h1>
      </div>

      <div style={styles.hamburger} onClick={toggleMenu}>
        <div
          style={{
            ...styles.hamburgerLine,
            transform: isMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
          }}
        />
        <div
          style={{
            ...styles.hamburgerLine,
            width: isMenuOpen ? "0" : "24px",
            margin: isMenuOpen ? "0" : "0 auto",
          }}
        />
        <div
          style={{
            ...styles.hamburgerLine,
            transform: isMenuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none",
          }}
        />
      </div>

      <div style={styles.navLinks}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={styles.navLink}
            title={link.title}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}