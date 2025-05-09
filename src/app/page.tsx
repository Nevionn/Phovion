/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import "./globals.css";
import { Album } from "./types/albumTypes";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SlSizeFullscreen } from "react-icons/sl";

const SortableAlbum = ({
  album,
  onClick,
}: {
  album: Album;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: album.id,
    transition: {
      duration: 150,
      easing: "ease-out",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "none",
    zIndex: isDragging ? 100 : 0,
    boxShadow: isDragging ? "0 8px 16px rgba(0, 0, 0, 0.3)" : "none",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      css={styles.albumCardStyle}
      style={style}
      onClick={onClick}
    >
      <div css={styles.dragHandleStyle} {...attributes} {...listeners}>
        <SlSizeFullscreen size={24} />
      </div>
      {album.avatar ? (
        <>
          <img
            src={album.avatar}
            alt={album.name}
            css={styles.albumAvatarStyle}
            loading="lazy"
          />
          <p css={styles.titleCardAlbumStyle}>
            <span>{album.name}</span>
            <span>{album.photoCount}</span>
          </p>
        </>
      ) : (
        <div css={styles.albumPlaceholderStyle}>
          <p css={styles.titleCardAlbumStyle}>
            <span>{album.name}</span>
            <span>{album.photoCount}</span>
          </p>
          <span css={styles.placeholderTextStyle}>Нет фото</span>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [loading, setLoading] = useState(false);
  const [albumCount, setAlbumCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);

  const router = useRouter();

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAlbums((prevAlbums) => {
        const oldIndex = prevAlbums.findIndex(
          (album) => album.id === active.id
        );
        const newIndex = prevAlbums.findIndex((album) => album.id === over?.id);

        const newAlbums = arrayMove(prevAlbums, oldIndex, newIndex);

        const updatedOrder = newAlbums.map((album, index) => ({
          id: album.id,
          order: index,
        }));

        fetch("/api/albums/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ albums: updatedOrder }),
        }).catch((error) => console.error("Ошибка сохранения порядка:", error));

        return newAlbums;
      });
    }
  };

  const albumIds = useMemo(() => albums.map((album) => album.id), [albums]);

  return (
    <main css={styles.mainStyleCyber}>
      <div css={styles.headerStyle}>
        <h1 css={styles.titleStyle}>
          Альбомы
          <br /> альбомов: {albumCount} фотографий: {photoCount}
        </h1>
      </div>

      <div css={styles.createAlbumStyle}>
        <input
          css={styles.inputStyle}
          type="text"
          placeholder="Название альбома"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <button
          css={styles.buttonStyle}
          onClick={createAlbum}
          disabled={loading}
        >
          {loading ? "Создание..." : "Создать"}
        </button>
        <button
          css={styles.deleteButtonStyle}
          onClick={deleteAllAlbums}
          disabled={loading || albums.length === 0}
        >
          {loading ? "Удаление..." : "Удалить все"}
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={albumIds} strategy={rectSortingStrategy}>
          <div css={styles.albumListStyle}>
            {albums.map((album) => (
              <SortableAlbum
                key={album.id}
                album={album}
                onClick={() => router.push(`/album/${album.id}`)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </main>
  );
}

const styles = {
  mainStyleCyber: css({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "90vh",
    width: 876, // "46%"
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
  headerStyle: css({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  }),
  titleStyle: css({
    fontSize: "2rem",
    color: "white",
  }),
  createAlbumStyle: css({
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  }),
  inputStyle: css({
    padding: "0.5rem",
    border: "2px solid purple",
    borderRadius: "8px",
    fontSize: "1rem",
  }),
  buttonStyle: css({
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
  deleteButtonStyle: css({
    padding: "0.5rem 1rem",
    backgroundImage: "linear-gradient(211deg, #933232 0%, #7a2a2a 100%)",
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
  albumListStyle: css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(265px, 1fr))",
    gap: "24px",
    padding: "30px 0",
    width: "100%",
    maxWidth: "862px",
  }),
  albumCardStyle: css({
    position: "relative",
    width: 265,
    height: 300,
    borderRadius: "10px",
    cursor: "pointer",
    overflow: "hidden",
    "&:hover": {
      transform: "scale(1.02)",
    },
  }),
  dragHandleStyle: css({
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "5px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "4px",
    cursor: "grab",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    "&:active": {
      cursor: "grabbing",
    },
  }),
  albumAvatarStyle: css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
  }),
  albumPlaceholderStyle: css({
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
  titleCardAlbumStyle: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    padding: "0.5rem",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
    fontSize: "1.2rem",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    "& > span:first-of-type": {
      maxWidth: "70%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "& > span:last-of-type": {
      fontSize: "1rem",
      opacity: 0.8,
    },
  }),
  placeholderTextStyle: css({
    fontSize: "0.9rem",
    color: "#666",
    marginTop: "0.5rem",
  }),
};

// mainStyleGeneral: css({
//   display: "flex",
//   alignItems: "center",
//   flexDirection: "column",
//   minHeight: "100vh",
//   width: "60%",
//   padding: "2rem",
//   margin: "0 auto",
//   marginTop: 14,
//   backgroundColor: "#1b1c2e",
// }),
