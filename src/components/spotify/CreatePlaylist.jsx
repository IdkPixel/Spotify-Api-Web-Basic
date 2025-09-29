import React, { useState } from "react";

function CreatePlaylist({ token, onPlaylistCreated }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    if (!name) return setMessage("⚠️ Ingresa un nombre");

    try {
      // Obtener user_id
      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      // Crear playlist
      const res = await fetch(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description: "Playlist creada desde mi dashboard 🎵",
            public: false,
          }),
        }
      );

      if (res.ok) {
        const newPlaylist = await res.json();
        setMessage(`✅ Playlist "${newPlaylist.name}" creada con éxito`);
        setName("");

        // Notificar al padre (Dashboard) para refrescar la lista
        if (onPlaylistCreated) onPlaylistCreated(newPlaylist);
      } else {
        setMessage("❌ Error al crear playlist");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error en la API");
    }
  };

  return (
    <div className="my-3">
      <h4>Crear Playlist</h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la playlist"
        className="form-control mb-2"
      />
      <button className="btn btn-success" onClick={handleCreate}>
        Crear
      </button>
      {message && <p className="mt-2 text-light">{message}</p>}
    </div>
  );
}

export default CreatePlaylist;
