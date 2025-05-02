/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Photo = { id: number; path: string; order: number };

export default function AlbumPage() {
  const router = useRouter();
  const { id } = useParams();
  const [album, setAlbum] = useState<{ id: number; name: string } | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Получаем данные альбома и список фото
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/albums/${id}`);
      const { photos: p, ...alb } = await res.json();
      setAlbum(alb);
      setPhotos(p || []);
    }
    fetchData();
  }, [id]);

  // Удаление альбома
  async function deleteAlbum() {
    if (!confirm("Удалить альбом?")) return;
    const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/");
    else alert("Ошибка удаления альбома");
  }

  // Загрузка фото
  async function uploadPhoto() {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("albumId", String(id));
    form.append("photo", file);

    const res = await fetch("/api/photos/upload", {
      method: "POST",
      body: form,
    });
    if (res.ok) {
      setFile(null);
      // обновляем списки
      const newPhoto: Photo = await res.json();
      setPhotos((prev) => [...prev, newPhoto]);
    } else {
      alert("Ошибка загрузки");
    }
    setUploading(false);
  }

  return (
    <main css={style.main}>
      {album ? (
        <>
          <h1 css={style.title}>Альбом: {album.name}</h1>
          <p>ID: {album.id}</p>
          <button css={style.deleteButton} onClick={deleteAlbum}>
            Удалить альбом
          </button>

          <div css={style.uploadSection}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
              css={style.uploadButton}
              onClick={uploadPhoto}
              disabled={!file || uploading}
            >
              {uploading ? "Загрузка..." : "Загрузить фото"}
            </button>
          </div>

          <div css={style.photoGrid}>
            {photos.map((ph) => (
              <img
                key={ph.id}
                src={ph.path}
                alt={`Фото ${ph.id}`}
                css={style.photo}
              />
            ))}
          </div>
        </>
      ) : (
        <p css={style.loadingText}>Загрузка альбома...</p>
      )}
    </main>
  );
}

const style = {
  main: css({
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "grey",
  }),
  title: css({
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#111",
  }),
  loadingText: css({
    color: "#555",
    fontSize: 20,
  }),
  deleteButton: css({
    backgroundColor: "#d32f2f",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: 8,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "background-color 0.2s",
    "&:hover": { backgroundColor: "#b71c1c" },
  }),
  uploadSection: css({
    marginTop: "2rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  }),
  uploadButton: css({
    backgroundColor: "#0070f3",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: 8,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": { backgroundColor: "#005bb5" },
    "&:disabled": { backgroundColor: "#ccc", cursor: "not-allowed" },
  }),
  photoGrid: css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "1rem",
    marginTop: "2rem",
    backgroundColor: "white",
  }),
  photo: css({
    width: "100%",
    borderRadius: 8,
    objectFit: "cover",
  }),
};
