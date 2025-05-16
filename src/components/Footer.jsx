import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: "#f2f2f2",
            padding: "1rem",
            marginTop: "2rem",
            textAlign: "center",
            direction: "rtl",
        }}>
            <nav>
                <Link to="/about" style={{ margin: "0 1rem" }}>אודות</Link>
                <Link to="/faq" style={{ margin: "0 1rem" }}>שאלות נפוצות</Link>
                <Link to="/privacy-policy" style={{ margin: "0 1rem" }}>מדיניות פרטיות</Link>
                <Link to="/terms-of-service" style={{ margin: "0 1rem" }}>תנאי שימוש</Link>
            </nav>
            <p style={{ marginTop: "1rem" }}>© כל הזכויות שמורות 2025</p>
        </footer>
    );
}
