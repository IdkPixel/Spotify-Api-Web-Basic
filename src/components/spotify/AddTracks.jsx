import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

function AddTracks({ token }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  // 🔹 Traer playlists del usuario
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.items) setPlaylists(data.items);
      } catch (err) {
        console.error("Error al cargar playlists:", err);
      }
    };
    if (token) fetchPlaylists();
  }, [token]);

  // 🔹 Buscar canciones en Spotify
  const handleSearch = async () => {
    if (!search) return;
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          search
        )}&type=track&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.tracks?.items) {
        setResults(data.tracks.items);
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
    }
  };

  // 🔹 Agregar canción a la playlist seleccionada
  const handleAddTrack = async (trackUri) => {
    if (!playlistId) return setMessage("⚠️ Selecciona una playlist primero");

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [trackUri] }),
        }
      );

      if (res.ok) {
        setMessage("✅ Track agregado correctamente");
        setResults([]);
        setSearch("");
      } else {
        setMessage("❌ Error al agregar track");
      }
    } catch (err) {
      console.error(err);
      setMessage("🚨 Error en la API de Spotify");
    }
  };

  return (
    <div
      className="p-4 rounded shadow"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
    >
      <h4 className="mb-3 text-success">🎵 Agregar Track a Playlist</h4>

      {/* Selector de playlist */}
      <div className="mb-3">
        <label className="form-label">Selecciona una Playlist</label>
        <select
          className="form-select"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          {playlists.map((pl) => (
            <option key={pl.id} value={pl.id}>
              {pl.name}
            </option>
          ))}
        </select>
      </div>

      {/* Búsqueda de canciones */}
      <div className="mb-3">
        <label className="form-label">Buscar Canción</label>
        <div className="d-flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ej: Duki, Paulo Londra..."
            className="form-control me-2"
          />
          <button className="btn btn-success" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="mt-3">
          <h5 className="text-success">Resultados:</h5>
          {results.map((track) => (
            <div
              key={track.id}
              className="d-flex align-items-center justify-content-between p-2 mb-2"
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
              }}
            >
              <div className="d-flex align-items-center">
                <img
                  src={track.album.images[2]?.url}
                  alt={track.name}
                  style={{ width: "50px", borderRadius: "6px", marginRight: "10px" }}
                />
                <div>
                  <p className="m-0 fw-bold">{track.name}</p>
                  <small>{track.artists.map((a) => a.name).join(", ")}</small>
                </div>
              </div>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleAddTrack(track.uri)}
              >
                <FaPlus /> Agregar
              </button>
            </div>
          ))}
        </div>
      )}

      {message && (
        <div className="mt-3 alert alert-info p-2 text-center">{message}</div>
      )}
    </div>
  );
}

export default AddTracks;
