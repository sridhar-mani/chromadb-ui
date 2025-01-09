import React, { useEffect } from "react";

interface FloatingAlertProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number; // Duration in milliseconds
  onClose?: () => void;
}

const FloatingAlert: React.FC<FloatingAlertProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const alertStyles: { [key: string]: React.CSSProperties } = {
    base: {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "15px 20px",
      borderRadius: "8px",
      zIndex: 1000,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "opacity 0.3s ease-in-out",
    },
    info: {
      backgroundColor: "#e0f7fa",
      color: "#00796b",
    },
    success: {
      backgroundColor: "#e8f5e9",
      color: "#388e3c",
    },
    warning: {
      backgroundColor: "#fff8e1",
      color: "#f57c00",
    },
    error: {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
    },
  };

  const combinedStyle: React.CSSProperties = {
    ...alertStyles.base,
    ...(alertStyles[type] || alertStyles.info),
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div style={combinedStyle}>{message}</div>;
};

export default FloatingAlert;
