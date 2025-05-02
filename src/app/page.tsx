/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import "./globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Album = { id: number; name: string; avatar: string | null };

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    try {
      const res = await fetch("/api/albums/take");
      if (!res.ok) throw new Error("Ошибка загрузки альбомов");
      const data = await res.json();
      setAlbums(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  async function createAlbum() {
    if (!newAlbumName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/albums/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAlbumName }),
      });
      if (res.ok) {
        setNewAlbumName("");
        await fetchAlbums();
      }
    } catch (error) {
      console.error("Ошибка создания альбома:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main css={style.mainStyleCyber}>
      <h1 css={style.title}>Альбомы</h1>

      <div css={style.createAlbum}>
        <input
          css={style.input}
          type="text"
          placeholder="Название альбома"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <button css={style.button} onClick={createAlbum} disabled={loading}>
          {loading ? "Создание..." : "Создать"}
        </button>
      </div>

      <div css={style.albumList}>
        {albums.map((album) => (
          <div
            key={album.id}
            css={style.albumCard}
            onClick={() => router.push(`/album/${album.id}`)}
          >
            {album.avatar ? (
              <>
                <img
                  src={album.avatar}
                  alt={album.name}
                  css={style.albumAvatar}
                />
                <p css={style.titleCardAlbum}>{album.name}</p>
              </>
            ) : (
              <div css={style.albumPlaceholder}>
                <p css={style.titleCardAlbum}>{album.name}</p>
                <span css={style.placeholderText}>Нет фото</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

const style = {
  mainStyleGeneral: css({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "100vh",
    width: "60%",
    padding: "2rem",
    margin: "0 auto",
    marginTop: 14,
    backgroundColor: "#1b1c2e",
  }),
  mainStyleCyber: css({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "90vh",
    width: "60%",
    padding: "2rem",
    margin: "0 auto",
    marginTop: 14,
    borderRadius: "1rem",
    background:
      "linear-gradient(180deg, rgba(35, 42, 70, 0.4) 0%, rgba(20, 25, 45, 0.4) 100%)",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(21, 133, 208, 0.94)",
    color: "white",
  }),
  title: css({
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "white",
  }),
  createAlbum: css({
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  }),
  input: css({
    padding: "0.5rem",
    border: "2px solid purple",
    borderRadius: "8px",
    fontSize: "1rem",
  }),
  button: css({
    padding: "0.5rem 1rem",
    backgroundImage: "linear-gradient(211deg, #846392 0%, #604385 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "filter 0.2s, box-shadow 0.2s",
    fontSize: "1rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      filter: "brightness(1.15)",
    },
    "&:disabled": {
      backgroundImage: "none",
      backgroundColor: "#ccc",
      cursor: "not-allowed",
      boxShadow: "none",
    },
  }),
  albumList: css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(265px, 1fr))",
    gap: "24px",
    padding: "30px 0",
    width: "100%",
    maxWidth: "862px",
  }),
  albumCard: css({
    position: "relative",
    width: 265,
    height: 300,
    borderRadius: "10px",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)",
    },
  }),
  albumAvatar: css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
  }),
  albumPlaceholder: css({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: "10px",
    color: "#666",
    fontSize: "0.9rem",
    position: "relative",
  }),
  titleCardAlbum: css({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    padding: "0.5rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
    fontSize: "1.2rem",
    textAlign: "center",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
  }),
  placeholderText: css({
    fontSize: "0.9rem",
    color: "#666",
    marginTop: "0.5rem",
  }),
};
