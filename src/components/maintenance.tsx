export default function Maintenance() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
          color: "#333",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Our website is under moderation
        </h1>
        <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
          We are currently making improvements. Please check back later!
        </p>
        <img
          src="img/maintenance.jpg" // Добавьте изображение в папку public/
          alt="Maintenance"
          style={{ maxWidth: "100%", height: "auto", marginBottom: "2rem" }}
        />
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Thank you for your patience.
        </p>
      </div>
    );
  }
  