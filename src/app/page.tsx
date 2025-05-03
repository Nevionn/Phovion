/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import "./globals.css";
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

type Album = { id: number; name: string; avatar: string | null };

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
    <div ref={setNodeRef} css={albumCardStyle} style={style} onClick={onClick}>
      {/* Иконка для drag-and-drop */}
      <div css={dragHandleStyle} {...attributes} {...listeners}>
        <SlSizeFullscreen size={24} />
      </div>
      {album.avatar ? (
        <>
          <img
            src={album.avatar}
            alt={album.name}
            css={albumAvatarStyle}
            loading="lazy"
          />
          <p css={titleCardAlbumStyle}>{album.name}</p>
        </>
      ) : (
        <div css={albumPlaceholderStyle}>
          <p css={titleCardAlbumStyle}>{album.name}</p>
          <span css={placeholderTextStyle}>Нет фото</span>
        </div>
      )}
    </div>
  );
};

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAlbums((prevAlbums) => {
        const oldIndex = prevAlbums.findIndex(
          (album) => album.id === active.id
        );
        const newIndex = prevAlbums.findIndex((album) => album.id === over?.id);

        const newAlbums = arrayMove(prevAlbums, oldIndex, newIndex);

        // Отправляем новый порядок в бд
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
    <main css={mainStyleCyber}>
      <h1 css={titleStyle}>Альбомы</h1>

      <div css={createAlbumStyle}>
        <input
          css={inputStyle}
          type="text"
          placeholder="Название альбома"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <button css={buttonStyle} onClick={createAlbum} disabled={loading}>
          {loading ? "Создание..." : "Создать"}
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={albumIds} strategy={rectSortingStrategy}>
          <div css={albumListStyle}>
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

const mainStyleCyber = css({
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
  border: "1px solid rgba(21, 133, 208, 0.94)",
  color: "white",
});
const titleStyle = css({
  fontSize: "2rem",
  marginBottom: "1.5rem",
  color: "white",
});
const createAlbumStyle = css({
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
});
const inputStyle = css({
  padding: "0.5rem",
  border: "2px solid purple",
  borderRadius: "8px",
  fontSize: "1rem",
});
const buttonStyle = css({
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
});
const albumListStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(265px, 1fr))",
  gap: "24px",
  padding: "30px 0",
  width: "100%",
  maxWidth: "862px",
});
const albumCardStyle = css({
  position: "relative",
  width: 265,
  height: 300,
  borderRadius: "10px",
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    transform: "scale(1.02)",
  },
});
const dragHandleStyle = css({
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
});
const albumAvatarStyle = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "10px",
});
const albumPlaceholderStyle = css({
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
});
const titleCardAlbumStyle = css({
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
});
const placeholderTextStyle = css({
  fontSize: "0.9rem",
  color: "#666",
  marginTop: "0.5rem",
});

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
