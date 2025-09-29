import React, { useState, useEffect } from "react";
import axios from "axios";

function PlaylistList({ token, onSelect, refreshKey }) {
  const [playlists, setPlaylists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const playlistsPerPage = 4; // 👈 Cuántas playlists por página

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      try {
        let allPlaylists = [];
        let offset = 0;
        const limit = 50; // máximo que permite Spotify en un request
        let fetched;

        do {
          const res = await axios.get(
            `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          fetched = res.data.items;
          allPlaylists = [...allPlaylists, ...fetched];
          offset += limit;
        } while (fetched.length > 0);

        setPlaylists(allPlaylists);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };

    if (token) fetchAllPlaylists();
  }, [token, refreshKey]);

  // Calcular playlists visibles en la página actual
  const indexOfLast = currentPage * playlistsPerPage;
  const indexOfFirst = indexOfLast - playlistsPerPage;
  const currentPlaylists = playlists.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(playlists.length / playlistsPerPage);

  return (
    <div className="text-center">
      {/* Playlists de la página actual */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
        {currentPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => onSelect(playlist)}
            className="p-2"
            style={{
              width: "140px",
              cursor: "pointer",
              borderRadius: "12px",
              backgroundColor: "#1e1e1e",
              textAlign: "center",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <img
              src={playlist.images[0]?.url || "https://via.placeholder.com/120"}
              alt={playlist.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "6px",
              }}
            />
            <p
              style={{
                fontSize: "0.85rem",
                color: "#fff",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {playlist.name}
            </p>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-success" : "btn-dark"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistList;
