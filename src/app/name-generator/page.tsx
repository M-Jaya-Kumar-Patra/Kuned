"use client";

export default function Loader() {
  return (
    <div className="loaderContainer">
      
      <div className="logoWrapper">
        <img
          src="/images/logo_dark.png"
          alt="Kuned"
          className="logo"
        />
      </div>

      <p className="subtitle">Loading your experience...</p>

    </div>
  );
}