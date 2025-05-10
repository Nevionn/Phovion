/** @jsxImportSource @emotion/react */
"use client";
import { css, CacheProvider, keyframes } from "@emotion/react";
import createCache from "@emotion/cache";
import "../../shared/buttons/cyber-button.css";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Photo } from "./types/photoTypes";
import { Album } from "@/app/types/albumTypes";
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
import CyberButton from "@/app/shared/buttons/CyberButton";

const emotionCache = createCache({ key: "css", prepend: true });

type AlbumForViewPhotos = Pick<Album, "id" | "name">;

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

const AlbumPageClient = () => {
  const router = useRouter();
  const { id } = useParams();
  const [album, setAlbum] = useState<AlbumForViewPhotos | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Получаем данные альбома и список фото
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/albums/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Ошибка загрузки: ${res.statusText}`);
        }
        const { photos: p, ...alb } = await res.json();
        console.log("Загруженные данные при старте:", {
          album: alb,
          photos: p,
        });
        setAlbum(alb);
        setPhotos(p || []);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setIsLoading(false);
      }
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

    if (!over || active.id === over.id) {
      return;
    }

    const newPhotos = await new Promise<Photo[]>((resolve) => {
      setPhotos((prevPhotos) => {
        const oldIndex = prevPhotos.findIndex(
          (photo) => photo.id === active.id
        );
        const newIndex = prevPhotos.findIndex((photo) => photo.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
          console.error("Некорректные индексы:", { oldIndex, newIndex });
          resolve(prevPhotos);
          return prevPhotos;
        }

        const updatedPhotos = arrayMove(prevPhotos, oldIndex, newIndex);
        resolve(updatedPhotos);
        return updatedPhotos;
      });
    });

    const updatedOrder = newPhotos.map((photo, index) => ({
      id: photo.id,
      order: index,
    }));

    try {
      console.log("Отправка нового порядка на сервер:", updatedOrder);
      const res = await fetch("/api/photos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: updatedOrder }),
      });

      if (!res.ok) {
        throw new Error(`Ошибка сохранения порядка: ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log("Ответ от сервера (reorder):", responseData);

      const updatedRes = await fetch(`/api/albums/${id}`, {
        cache: "no-store",
      });
      if (updatedRes.ok) {
        const { photos: updatedPhotos, ...updatedAlbum } =
          await updatedRes.json();
        setAlbum(updatedAlbum);
        setPhotos(updatedPhotos || []);
        console.log("Обновленный порядок с сервера:", updatedPhotos);
      } else {
        throw new Error("Не удалось обновить данные после сортировки");
      }
    } catch (error) {
      console.error("Ошибка сохранения порядка:", error);
      alert("Не удалось сохранить порядок фотографий");
      const res = await fetch(`/api/albums/${id}`, { cache: "no-store" });
      if (res.ok) {
        const { photos: p, ...alb } = await res.json();
        setAlbum(alb);
        setPhotos(p || []);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDraggingOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (droppedFiles.length > 0) {
        setFiles(droppedFiles);
        uploadPhotos();
      }
    }
  };

  const photoIds = useMemo(() => photos.map((photo) => photo.id), [photos]);

  return (
    <CacheProvider value={emotionCache}>
      <main
        css={style.main}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div css={style.contentWrapper}>
          {isLoading ? (
            <div css={style.skeletonWrapper}>
              <div css={style.skeletonHeader}></div>
              <div css={style.skeletonGrid}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} css={style.skeletonPhoto}></div>
                ))}
              </div>
            </div>
          ) : album ? (
            <>
              <div css={style.header}>
                <div css={style.headerContainer}>
                  <h1 css={style.title}>Альбом: {album.name}</h1>
                  <CyberButton
                    label="Удалить альбом"
                    hue={0}
                    onClick={deleteAlbum}
                  />
                  <div css={style.uploadSection}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setFiles(
                          e.target.files ? Array.from(e.target.files) : []
                        )
                      }
                      css={style.uploadInput}
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
              </div>

              {photos.length === 0 ? (
                <p css={style.loadingText}>
                  Перетащите изображения сюда или выберите файлы
                </p>
              ) : (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={photoIds}
                    strategy={rectSortingStrategy}
                  >
                    <div css={style.photoGrid}>
                      {photos.map((photo) => (
                        <SortablePhoto key={photo.id} photo={photo} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </>
          ) : (
            <p css={style.loadingText}>Ошибка загрузки альбома</p>
          )}
          {isDraggingOver && !isLoading && (
            <div css={style.dropZoneDragging}>
              <div css={style.dragOverlay}>
                <FaCloudUploadAlt size={80} />
                <span>Загрузить фотографии</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </CacheProvider>
  );
};

const AlbumPage = dynamic(() => Promise.resolve(AlbumPageClient), {
  ssr: false,
  loading: () => (
    <main css={style.main}>
      <div css={style.contentWrapper}>
        <div css={style.skeletonWrapper}>
          <div css={style.skeletonHeader}></div>
          <div css={style.skeletonGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} css={style.skeletonPhoto}></div>
            ))}
          </div>
        </div>
      </div>
    </main>
  ),
});

const AlbumPageWithSuspense = () => (
  <Suspense
    fallback={
      <main css={style.main}>
        <div css={style.contentWrapper}>
          <div css={style.skeletonWrapper}>
            <div css={style.skeletonHeader}></div>
            <div css={style.skeletonGrid}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} css={style.skeletonPhoto}></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    }
  >
    <AlbumPage />
  </Suspense>
);

export default AlbumPageWithSuspense;

const style = {
  main: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    textAlign: "center",
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    fontFamily: "'Orbitron', sans-serif",
    minHeight: "100vh",
    position: "relative",
  }),
  contentWrapper: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    zIndex: 1,
  }),
  header: css({
    zIndex: 10,
    width: "100%",
    maxWidth: "1200px",
  }),
  headerContainer: css({
    position: "relative",
    border: "2px solid #00ffea",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow:
      "0 0 20px rgba(0, 255, 234, 0.5), inset 0 0 10px rgba(0, 255, 234, 0.3)",
    backdropFilter: "blur(5px)",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "-2px",
      left: "-2px",
      right: "-2px",
      bottom: "-2px",
      borderRadius: "12px",
      zIndex: -1,
      animation: "neonBorder 3s infinite linear",
    },
  }),
  title: css({
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#00ffea",
    textShadow:
      "0 0 10px rgba(0, 255, 234, 0.8), 0 0 20px rgba(0, 255, 234, 0.5)",
    fontWeight: 700,
    letterSpacing: "2px",
  }),
  loadingText: css({
    color: "white",
    fontSize: 20,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 3,
    pointerEvents: "none",
  }),
  // deleteButton: css({
  //   background: "linear-gradient(45deg, #ff004d, #ff4d77)", // Неоновый градиент
  //   color: "white",
  //   padding: "0.5rem 1rem",
  //   border: "none",
  //   borderRadius: "8px",
  //   fontSize: "1rem",
  //   cursor: "pointer",
  //   clipPath: "xywh(0 5px 100% 75% round 35% 0);",
  //   marginTop: "1rem",
  //   transition: "all 0.3s",
  //   boxShadow: "0 0 10px rgba(255, 0, 77, 0.5)",
  //   "&:hover": {
  //     background: "linear-gradient(45deg, #ff4d77, #ff004d)",
  //     boxShadow: "0 0 15px rgba(255, 0, 77, 0.8)",
  //   },
  // }),
  uploadSection: css({
    marginTop: "2rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(20, 20, 40, 0.7)",
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid rgb(169, 31, 185)",
    boxShadow: "0 0 10px rgba(255, 0, 255, 0.3)",
  }),
  uploadButton: css({
    background: "linear-gradient(45deg, #00ffea, #00b8d4)",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 0 10px rgba(0, 255, 234, 0.5)",
    "&:hover": {
      background: "linear-gradient(45deg, #00b8d4, #00ffea)",
      boxShadow: "0 0 15px rgba(0, 255, 234, 0.8)",
    },
    "&:disabled": {
      background: "rgba(50, 50, 50, 0.7)",
      boxShadow: "none",
      cursor: "not-allowed",
    },
  }),
  uploadInput: css({
    color: "#00ffea",
    "&::file-selector-button": {
      background: "linear-gradient(45deg, #00ffea, #00b8d4)",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 0 10px rgba(0, 255, 234, 0.5)",
      "&:hover": {
        background: "linear-gradient(45deg, #00b8d4, #00ffea)",
        boxShadow: "0 0 15px rgba(0, 255, 234, 0.8)",
      },
    },
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
    zIndex: 5,
  }),
  dropZoneDragging: css({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: "2px dashed white",
    margin: "20px",
    borderRadius: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 20, // Выше всех элементов, включая photoGrid
    pointerEvents: "none", // Чтобы не мешать событиям dnd
  }),
  dragOverlay: css({
    position: "absolute",
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
    zIndex: 21, // Еще выше, чем dropZoneDragging
    pointerEvents: "none",
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
  skeletonWrapper: css({
    width: "100%",
    maxWidth: "1200px",
    padding: "1rem",
    zIndex: 2, // Скелетный экран ниже оверлея
  }),
  skeletonHeader: css({
    height: "60px",
    width: "80%",
    margin: "0 auto 2rem",
    backgroundColor: "#6A5E5C",
    borderRadius: "8px",
    animation: "pulse 1.5s infinite",
  }),
  skeletonGrid: css({
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    maxWidth: "1200px",
    width: "100%",
  }),
  skeletonPhoto: css({
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: "#6A5E5C",
    borderRadius: "8px",
    animation: "pulse 1.5s infinite",
  }),
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.6 },
    "100%": { opacity: 1 },
  },
};
