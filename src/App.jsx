import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import SpotifyDashboard from "./components/SpotifyDashboard";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLogged(true);
  }, []);

  const handleLoginSuccess = () => setIsLogged(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("spotifyToken");
    setIsLogged(false);
  };

  if (isLogged) return <SpotifyDashboard onLogout={handleLogout} />;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#000", // fondo negro
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg p-5 text-center"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#000", // formulario negro
          color: "#fff",
        }}
      >
        <div
          className="mx-auto mb-4 d-flex align-items-center justify-content-center"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#1DB954",
            color: "#fff",
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          👤
        </div>

        <h2 className="mb-4 fw-bold" style={{ color: "#1DB954" }}>
          {isRegister ? "Crear cuenta" : "Bienvenido"}
        </h2>

        {isRegister ? (
          <RegisterForm onSwitch={() => setIsRegister(false)} />
        ) : (
          <LoginForm
            onSwitch={() => setIsRegister(true)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default App;
