/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Album } from "../types/albumTypes";
import { useState, useEffect } from "react";
import { AlbumNaming } from "../types/albumTypes";
import AlbumsControls from "./AlbumsControls";
import AlbumsGrid from "./AlbumsGrid";
import BackToTopButton from "../shared/buttons/BackToTopButton";
import BackToBottomButton from "../shared/buttons/BackToBottomButton";

const AlbumsListContainer = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumCount, setAlbumCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAlbums(), fetchCounts()]);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  async function fetchAlbums() {
    const res = await fetch("/api/albums/take");
    if (!res.ok) throw new Error("Ошибка загрузки альбомов");
    const data = await res.json();
    setAlbums(data);
  }

  async function fetchCounts() {
    const [albumRes, photoRes] = await Promise.all([
      fetch("/api/albums/count"),
      fetch("/api/photos/count"),
    ]);

    if (!albumRes.ok) throw new Error("Ошибка получения количества альбомов");
    if (!photoRes.ok) throw new Error("Ошибка получения количества фотографий");

    const albumData = await albumRes.json();
    const photoData = await photoRes.json();

    setAlbumCount(albumData.albums);
    setPhotoCount(photoData.photos);
  }

  async function createAlbum({ name, description }: AlbumNaming) {
    setLoading(true);
    try {
      const res = await fetch("/api/albums/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
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
    <>
      <div css={styles.containerStyle}>
        <>
          <AlbumsControls
            loading={loading}
            albumCount={albumCount}
            photoCount={photoCount}
            createAlbum={createAlbum}
            deleteAllAlbums={deleteAllAlbums}
          />
          <AlbumsGrid albums={albums} setAlbums={setAlbums} />
        </>
      </div>
      <BackToTopButton />
      <BackToBottomButton />
    </>
  );
};

export default AlbumsListContainer;

const styles = {
  containerStyle: css({
    display: "flex",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "90vh",
    maxWidth: "90%",
    width: "100%",
    overflowX: "auto",
    padding: "2rem",
    borderRadius: "1rem",
    background:
      "linear-gradient(180deg, rgba(35, 42, 70, 0.4) 0%, rgba(20, 25, 45, 0.4) 100%)",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.6)",
    border: "var(--list-container-border-color)",
    color: "white",

    "@media (min-width: 1200px)": {
      maxWidth: 876,
    },
    "@media (max-width: 768px)": {
      maxWidth: "85%",
      padding: "1.5rem",
    },
    "@media (max-width: 480px)": {
      maxWidth: "90%",
      padding: "1rem",
      borderRadius: "0.5rem",
    },
  }),
};
