/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Album } from "../types/albumTypes";
import { useState, useEffect } from "react";
import AlbumControls from "./AlbumControls";
import AlbumGrid from "./AlbumGrid";
import BackToTopButton from "../shared/buttons/BackToTopButton";

const AlbumListContainer = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [loading, setLoading] = useState(false);
  const [albumCount, setAlbumCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    fetchAlbums();
    fetchCounts();
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

  async function fetchCounts() {
    try {
      const [albumRes, photoRes] = await Promise.all([
        fetch("/api/albums/count"),
        fetch("/api/photos/count"),
      ]);

      if (!albumRes.ok) throw new Error("Ошибка получения количества альбомов");
      if (!photoRes.ok)
        throw new Error("Ошибка получения количества фотографий");

      const albumData = await albumRes.json();
      const photoData = await photoRes.json();

      setAlbumCount(albumData.albums);
      setPhotoCount(photoData.photos);
    } catch (error) {
      console.error("Ошибка получения статистики:", error);
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
        await Promise.all([fetchAlbums(), fetchCounts()]);
      }
    } catch (error) {
      console.error("Ошибка создания альбома:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteAllAlbums() {
    if (
      !window.confirm(
        "Вы уверены, что хотите удалить все альбомы и их фотографии?"
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/albums/deleteAll", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Ошибка удаления альбомов");
      setAlbums([]);
      setAlbumCount(0);
      setPhotoCount(0);
    } catch (error) {
      console.error("Ошибка удаления альбомов:", error);
      alert("Ошибка при удалении альбомов");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div css={styles.containerStyle}>
      <AlbumControls
        newAlbumName={newAlbumName}
        setNewAlbumName={setNewAlbumName}
        loading={loading}
        albumCount={albumCount}
        photoCount={photoCount}
        createAlbum={createAlbum}
        deleteAllAlbums={deleteAllAlbums}
      />
      <AlbumGrid albums={albums} setAlbums={setAlbums} />
      <BackToTopButton />
    </div>
  );
};

export default AlbumListContainer;

const styles = {
  containerStyle: css({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "90vh",
    maxWidth: 876,
    overflowX: "auto",
    padding: "2rem",
    margin: "0 auto",
    marginTop: 14,
    borderRadius: "1rem",
    background:
      "linear-gradient(180deg, rgba(35, 42, 70, 0.4) 0%, rgba(20, 25, 45, 0.4) 100%)",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.6)",
    border: "1px solid rgba(21, 133, 208, 0.94)",
    color: "white",
  }),
};
