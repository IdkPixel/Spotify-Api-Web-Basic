import React, { useState, useEffect } from "react";
import axios from "axios";
import CreatePlaylist from "./spotify/CreatePlaylist";
import PlaylistList from "./spotify/PlaylistList";
import AddTracks from "./spotify/AddTracks";
import { FaGithub, FaInstagram } from "react-icons/fa"; 

const CLIENT_ID = "629cefce34594ddf9e76f55d54122bc2"; // Reemplaza con tu Client ID
const REDIRECT_URI = "http://localhost:5173/spotify-callback"; // Reemplaza con tu Redirect URI
const SCOPES = [
  "playlist-modify-private",
  "playlist-modify-public",
  "user-read-private",
  "user-read-playback-state",
  "user-read-currently-playing",
];

function SpotifyDashboard({ onLogout }) {
  const [connected, setConnected] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState("");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [spotifyUser, setSpotifyUser] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleConnectSpotify = () => {
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES.join("%20")}`;
    window.location.href = AUTH_URL;
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const token = hash.split("&")[0].split("=")[1];
      localStorage.setItem("spotifyToken", token);
      setSpotifyToken(token);
      setConnected(true);
      window.location.hash = "";
    } else {
      const token = localStorage.getItem("spotifyToken");
      if (token) {
        setSpotifyToken(token);
        setConnected(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!spotifyToken) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        });
        setSpotifyUser(res.data.display_name || res.data.id);
      } catch (err) {
        console.error("Error fetching Spotify user:", err);
      }
    };

    fetchUser();
  }, [spotifyToken]);

  useEffect(() => {
    if (!spotifyToken) return;

    const fetchCurrentTrack = async () => {
      try {
        const res = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );

        if (res.status === 200 && res.data) {
          setCurrentTrack({
            name: res.data.item.name,
            artists: res.data.item.artists.map((a) => a.name).join(", "),
            image: res.data.item.album.images[0].url,
            url: res.data.item.external_urls.spotify,
          });
        } else {
          setCurrentTrack(null);
        }
      } catch (err) {
        console.error("Error fetching current track:", err);
        setCurrentTrack(null);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("spotifyToken");
          setConnected(false);
        }
      }
    };

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 5000);
    return () => clearInterval(interval);
  }, [spotifyToken]);

  const handlePlaylistCreated = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div
      className="d-flex justify-content-center py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1DB954, #191414)",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {connected && (
        <>
          {/* Nombre del usuario */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "40px",
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: "bold",
              padding: "6px 12px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "18px" }}>👤</span>
            {spotifyUser}
          </div>

          {/* Botón cerrar sesión */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "40px",
            }}
          >
            <button
              className="btn"
              style={{
                backgroundColor: "#e22134",
                color: "#fff",
                fontWeight: "bold",
              }}
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}

      <div
        className="card p-4 shadow-lg"
        style={{
          width: "480px",
          borderRadius: "20px",
          backgroundColor: "#121212",
          color: "#fff",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: "#1DB954" }}>
            🎵 Spotify Dashboard
          </h2>
          {!connected && (
            <button
              className="btn mt-3 w-100"
              style={{
                backgroundColor: "#1DB954",
                color: "#fff",
                fontWeight: "bold",
              }}
              onClick={handleConnectSpotify}
            >
              Conectar cuenta de Spotify
            </button>
          )}
        </div>

        {connected && (
          <>
            <p className="text-success text-center fw-bold mb-4">
              Cuenta de Spotify conectada ✅
            </p>

            {currentTrack && (
              <div
                className="d-flex align-items-center mb-4 p-3"
                style={{ backgroundColor: "#1e1e1e", borderRadius: "12px" }}
              >
                <img
                  src={currentTrack.image}
                  alt={currentTrack.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    marginRight: "12px",
                  }}
                />
                <div>
                  <a
                    href={currentTrack.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#1DB954",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    {currentTrack.name}
                  </a>
                  <p style={{ margin: 0 }}>{currentTrack.artists}</p>
                </div>
              </div>
            )}

            {/* Listado de Playlists */}
            <div
              className="mb-4 p-3"
              style={{ backgroundColor: "#1e1e1e", borderRadius: "12px" }}
            >
              <h5 style={{ color: "#1DB954" }}>Mis Playlists</h5>
              <PlaylistList
                token={spotifyToken}
                onSelect={setSelectedPlaylist}
                refresh={refresh}
              />
            </div>

            {/* Crear Playlist */}
            <div
              className="mb-4 p-3"
              style={{ backgroundColor: "#1e1e1e", borderRadius: "12px" }}
            >
              <h5 style={{ color: "#1DB954" }}>Crear Playlist</h5>
              <CreatePlaylist
                token={spotifyToken}
                onPlaylistCreated={handlePlaylistCreated}
              />
            </div>

            {/* Añadir Canciones */}
            {selectedPlaylist && (
              <div
                className="mb-4 p-3"
                style={{ backgroundColor: "#1e1e1e", borderRadius: "12px" }}
              >
                <h5 style={{ color: "#1DB954" }}>
                  Añadir Canciones a "{selectedPlaylist.name}"
                </h5>
                <AddTracks
                  token={spotifyToken}
                  playlistId={selectedPlaylist.id}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer con GitHub e Instagram */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          display: "flex",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {/* GitHub */}
        <a
          href="https://github.com/IdkPixel"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "white",
            fontSize: "32px",
            transition: "color 0.3s, transform 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#1DB954";
            e.target.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "white";
            e.target.style.transform = "scale(1)";
          }}
        >
          <FaGithub />
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/idkwhynothello_/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "white",
            fontSize: "32px",
            transition: "color 0.3s, transform 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#E1306C"; // 
            e.target.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "white";
            e.target.style.transform = "scale(1)";
          }}
        >
          <FaInstagram />
        </a>
      </div>
    </div>
  );
}

export default SpotifyDashboard;
