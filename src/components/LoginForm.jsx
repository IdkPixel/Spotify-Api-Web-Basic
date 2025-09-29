import { useState } from "react";
import axios from "axios";

function LoginForm({ onSwitch, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });
      setMessage(res.data.message);
      setIsError(false);
      localStorage.setItem("token", res.data.token);
      onLoginSuccess();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error al iniciar sesión");
      setIsError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 text-start">
        <label className="form-label">Usuario</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ backgroundColor: "#000", color: "#fff", border: "1px solid #333" }}
        />
      </div>
      <div className="mb-3 text-start">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ backgroundColor: "#000", color: "#fff", border: "1px solid #333" }}
        />
      </div>
      <button
        type="submit"
        className="btn w-100 mb-3"
        style={{ backgroundColor: "#1DB954", color: "#fff", fontWeight: "bold" }}
      >
        Iniciar sesión
      </button>
      {message && (
        <p className={`mt-2 ${isError ? "text-danger" : "text-success"}`}>
          {message}
        </p>
      )}
      <p className="mt-3">
        ¿No tienes cuenta?{" "}
        <a href="#" onClick={onSwitch} style={{ color: "#1DB954" }}>
          Regístrate aquí
        </a>
      </p>
    </form>
  );
}

export default LoginForm;
