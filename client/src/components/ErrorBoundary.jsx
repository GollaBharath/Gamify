import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0e12",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{
            maxWidth: "500px",
            backgroundColor: "#16181f",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            border: "1px solid #2a2e3d"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚨</div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#a0a5b5", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
              An unexpected runtime error occurred. Our team has been notified. Please try reloading or returning home.
            </p>
            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center"
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #3f4456",
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)"}
                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
