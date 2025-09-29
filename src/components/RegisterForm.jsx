import { useState } from "react";
import axios from "axios";

function RegisterForm({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/register", {
        username,
        email,
        password,
      });
      setMessage(res.data.message);
      setIsError(false);

      // Redirigir automáticamente al login después de 1 segundo
      setTimeout(() => {
        onSwitch(); // cambia a la vista de login
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.error || "Error en el registro");
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
        <label className="form-label">Correo electrónico</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        Registrarse
      </button>
      {message && (
        <p className={`mt-2 ${isError ? "text-danger" : "text-success"}`}>
          {message}
        </p>
      )}
      <p className="mt-3">
        ¿Ya tienes cuenta?{" "}
        <a href="#" onClick={onSwitch} style={{ color: "#1DB954" }}>
          Inicia sesión aquí
        </a>
      </p>
    </form>
  );
}

export default RegisterForm;
