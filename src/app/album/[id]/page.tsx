/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Photo } from "./type/typePhoto";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SlSizeFullscreen } from "react-icons/sl";

const SortablePhoto = ({ photo }: { photo: Photo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: photo.id,
    transition: {
      duration: 150,
      easing: "ease-out",
    },
  });

  const styleDnd = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "none",
    zIndex: isDragging ? 100 : 0,
    boxShadow: isDragging ? "0 8px 16px rgba(0, 0, 0, 0.3)" : "none",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} css={style.photoContainer} style={styleDnd}>
      <div css={style.dragHandle} {...attributes} {...listeners}>
        <SlSizeFullscreen size={20} />
      </div>
      <img
        src={photo.path}
        alt={`Фото ${photo.id}`}
        css={style.photo}
        loading="lazy"
      />
    </div>
  );
};

export default function AlbumPage() {
  const router = useRouter();
  const { id } = useParams();
  const [album, setAlbum] = useState<{ id: number; name: string } | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [files, setFiles] = useState<File[]>([]);
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

  async function deleteAlbum() {
    if (!confirm("Удалить альбом?")) return;
    const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/");
    else alert("Ошибка удаления альбома");
  }

  async function uploadPhotos() {
    if (files.length === 0) return;
    setUploading(true);

    const form = new FormData();
    form.append("albumId", String(id));
    files.forEach((file) => form.append("photos", file));

    try {
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        const newPhotos: Photo[] = await res.json();
        setFiles([]);
        setPhotos((prev) => [...prev, ...newPhotos]);
      } else {
        alert("Ошибка загрузки фотографий");
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      alert("Ошибка загрузки фотографий");
    } finally {
      setUploading(false);
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPhotos((prevPhotos) => {
        const oldIndex = prevPhotos.findIndex(
          (photo) => photo.id === active.id
        );
        const newIndex = prevPhotos.findIndex((photo) => photo.id === over?.id);

        const newPhotos = arrayMove(prevPhotos, oldIndex, newIndex);

        // Отправляем новый порядок на сервер
        const updatedOrder = newPhotos.map((photo, index) => ({
          id: photo.id,
          order: index,
        }));

        fetch("/api/photos/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: updatedOrder }),
        }).catch((error) => console.error("Ошибка сохранения порядка:", error));

        return newPhotos;
      });
    }
  };

  const photoIds = useMemo(() => photos.map((photo) => photo.id), [photos]);

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
              multiple
              onChange={(e) =>
                setFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
            <button
              css={style.uploadButton}
              onClick={uploadPhotos}
              disabled={files.length === 0 || uploading}
            >
              {uploading
                ? "Загрузка..."
                : files.length > 0
                ? `Загрузить ${files.length} фото`
                : "Загрузить фото"}
            </button>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={photoIds} strategy={rectSortingStrategy}>
              <div css={style.photoGrid}>
                {photos.length === 0 ? (
                  <p css={style.loadingText}>Фотографии отсутствуют</p>
                ) : (
                  photos.map((photo) => (
                    <SortablePhoto key={photo.id} photo={photo} />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
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
    minHeight: "100vh",
  }),
  title: css({
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "white",
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
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginTop: "2rem",
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  }),
  photoContainer: css({
    position: "relative",
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    "&:hover": {
      transform: "scale(1.02)",
    },
  }),
  photo: css({
    width: "100%",
    borderRadius: 8,
    objectFit: "cover",
    aspectRatio: "1 / 1",
  }),
  dragHandle: css({
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
};
