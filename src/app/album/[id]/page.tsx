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
import { FaCloudUploadAlt } from "react-icons/fa";

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
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

  // Обработка DND из проводника
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Разрешаем сброс файлов
    setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      uploadPhotos();
    }
  };

  const photoIds = useMemo(() => photos.map((photo) => photo.id), [photos]);

  return (
    <main
      css={style.main}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        css={[style.contentWrapper, isDraggingOver && style.dropZoneDragging]}
      >
        {album ? (
          <>
            <div css={style.header}>
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
            </div>

            {photos.length === 0 && !isDraggingOver && (
              <p css={style.loadingText}>
                Перетащите изображения сюда или выберите файлы
              </p>
            )}

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={photoIds} strategy={rectSortingStrategy}>
                <div css={style.photoGrid}>
                  {photos.map((photo) => (
                    <SortablePhoto key={photo.id} photo={photo} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        ) : (
          <p css={style.loadingText}>Загрузка альбома...</p>
        )}
      </div>

      {isDraggingOver && (
        <div css={style.dragOverlay}>
          <FaCloudUploadAlt size={80} />
          <span>Загрузить фотографии</span>
        </div>
      )}
    </main>
  );
}

const style = {
  main: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#5A4F4D",
    minHeight: "100vh",
    position: "relative",
  }),
  contentWrapper: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
  }),
  header: css({
    zIndex: 10,
    width: "100%",
    maxWidth: "1200px",
  }),
  title: css({
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "white",
  }),
  loadingText: css({
    color: "white",
    fontSize: 20,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 3, // Выше photoGrid, но ниже dropZoneDragging
    pointerEvents: "none", // Чтобы не мешать DND
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
    width: "100%",
    padding: "1rem",
    borderRadius: 8,
    position: "relative",
    zIndex: 5, // Чтобы сетка была под dropZone, но над фоном
  }),
  dropZoneDragging: css({
    position: "fixed",
    inset: 0, // Покрывает весь экран
    border: "2px dashed white",
    margin: "20px",
    borderRadius: "8px",
    "&:before": {
      content: '""',
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 11,
    },
  }),
  dragOverlay: css({
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "50px",
    color: "white",
    fontWeight: "bold",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    zIndex: 10,
    "& > svg": {
      fontSize: "80px",
      marginBottom: "10px",
    },
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
