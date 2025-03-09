import React from "react";

function LoaderSmall() {
  return (
    <div
      className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style={{
        backdropFilter: "blur(5px)", // Blurs background content
        backgroundColor: "rgba(255, 255, 255, 0.6)", // Light transparent overlay
        zIndex: 1050,
      }}
    >
      <div
        className="spinner-border text-primary"
        role="status"
        style={{
          width: "3rem",
          height: "3rem",
          position: "relative",
          top: "-20px", // Moves spinner slightly upwards
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default LoaderSmall;
