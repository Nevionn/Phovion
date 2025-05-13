/** @jsxImportSource @emotion/react */
"use client";
import { css, CacheProvider, keyframes } from "@emotion/react";
import createCache from "@emotion/cache";
import "../../shared/buttons/cyber-button.css";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
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

// Утилита для преобразования Data URL в File
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Утилита для загрузки файла через прокси
async function proxyToFile(url: string, filename: string): Promise<File> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    console.log("Запрос прокси для URL:", url);
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Ошибка прокси: ${response.statusText}`);
    }
    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error("Получен пустой Blob");
    }
    return new File([blob], filename, { type: blob.type });
  } finally {
    clearTimeout(timeout);
  }
}

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

  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDanger, setShowDanger] = useState(false);

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
        setNewName(alb.name || "");
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
    files.forEach((file, index) => {
      if (file instanceof File && file.size > 0) {
        console.log(
          `Добавляем файл ${index + 1}:`,
          file.name,
          file.type,
          file.size
        );
        form.append("photos", file);
      } else {
        console.warn(`Файл ${index + 1} невалиден:`, file);
      }
    });

    try {
      console.log("Отправляем запрос на /api/photos/upload...");
      const controller = new AbortController();
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });

      if (res.ok) {
        const newPhotos: Photo[] = await res.json();
        console.log("Успешно загружено:", newPhotos);
        setFiles([]);
        setPhotos((prev) => [...prev, ...newPhotos]);
      } else {
        throw new Error(`Ошибка загрузки фотографий: ${res.statusText}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка загрузки:", errorMessage);
      alert(`Ошибка загрузки фотографий: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  }

  async function renameAlbum() {
    if (!newName || !album?.id) return;

    try {
      const res = await fetch(`/api/albums/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        const updatedAlbum = await res.json();
        setAlbum(updatedAlbum);
        setShowEdit(false);
        alert("Альбом успешно переименован!");
      } else {
        throw new Error("Ошибка переименования альбома");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка переименования:", errorMessage);
      alert(`Не удалось переименовать альбом: ${errorMessage}`);
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка сохранения порядка:", errorMessage);
      alert(`Не удалось сохранить порядок фотографий: ${errorMessage}`);
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

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDraggingOver(false);

      const droppedFiles: Set<File> = new Set(); // Явно указываем тип Set<File>

      // Логируем все типы данных в DataTransfer
      console.log("DataTransfer types:", e.dataTransfer.types);
      for (const type of e.dataTransfer.types) {
        console.log(`Data for ${type}:`, e.dataTransfer.getData(type));
      }

      // 1. Проверяем локальные файлы (перетаскивание из проводника)
      const localFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (localFiles.length > 0) {
        console.log("Найдены локальные файлы:", localFiles);
        localFiles.forEach((file) => droppedFiles.add(file));
      }

      // 2. Проверяем URL (перетаскивание из вкладки/браузера)
      const uriList = e.dataTransfer.getData("text/uri-list");
      const plainText = e.dataTransfer.getData("text/plain");
      const url = uriList || plainText; // Предпочитаем uri-list, но берём plainText, если uri-list пустой
      if (url && url.startsWith("http") && !url.startsWith("data:image/")) {
        console.log("Найден URL:", url);
        try {
          const filename = url.split("/").pop() || "image.jpg";
          const file = await proxyToFile(url, filename);
          droppedFiles.add(file);
          console.log("Успешно загружен файл через прокси:", file);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(
            "Ошибка загрузки изображения через прокси:",
            errorMessage
          );
          alert(`Не удалось загрузить изображение по URL: ${errorMessage}`);
        }
      }

      // 3. Проверяем Data URL (перетаскивание закодированного изображения)
      if (plainText && plainText.startsWith("data:image/")) {
        console.log("Найден Data URL:", plainText);
        try {
          const file = dataURLtoFile(plainText, "image-from-data-url.jpg");
          droppedFiles.add(file);
          console.log("Успешно преобразован Data URL в файл:", file);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error("Ошибка преобразования Data URL:", errorMessage);
          alert(`Не удалось обработать Data URL изображения: ${errorMessage}`);
        }
      }

      // Преобразуем Set в массив
      const finalFiles: File[] = Array.from(droppedFiles);
      console.log("Итоговый список файлов:", finalFiles);

      // Если есть файлы, добавляем их в состояние и вызываем загрузку
      if (finalFiles.length > 0) {
        setFiles(finalFiles);
        setTimeout(uploadPhotos, 0); // Даём React обновить состояние
      } else {
        alert("Перетащите изображение или выберите файлы!");
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
                  <div css={style.navigationItem}>
                    {/* Левая часть — Заголовок */}
                    <div>
                      <p css={style.title}>
                        <Link href="/" css={style.link}>
                          альбомы
                        </Link>
                        <span> {">"}</span>
                        <span> {album.name}</span>
                      </p>
                    </div>
                    {/* Правая часть — Кнопки */}
                    <div
                      css={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "3.5rem",
                        position: "relative",
                      }}
                    >
                      {/* Блок Редактировать */}
                      <div css={{ position: "relative" }}>
                        <CyberButton
                          label="Редактировать"
                          hue={200}
                          onClick={() => {
                            if (showEdit && album?.name) {
                              setNewName(album.name);
                            }
                            setShowEdit(!showEdit);
                          }}
                        />
                        {showEdit && (
                          <div
                            css={{
                              position: "absolute",
                              top: "100%",
                              left: -20,
                              right: -20,
                              backgroundColor: "#17688B",
                              border: "dashed rgb(55, 182, 232)",
                              marginTop: 10,
                              padding: 10,
                              borderRadius: 8,
                              zIndex: 10,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <span>Переименовать альбом</span>
                            <input
                              type="text"
                              placeholder={"новое название"}
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              css={{
                                marginTop: 10,
                                width: "100%",
                                backgroundColor: "#205788",
                                color: "white",
                                border: newName
                                  ? "2px solid rgb(19, 171, 113)"
                                  : "2px solid rgb(228, 13, 13)",
                                borderRadius: 10,
                              }}
                            />
                            <button
                              disabled={
                                !newName ||
                                newName.trim() === album?.name.trim()
                              }
                              css={{
                                marginTop: 10,
                                borderRadius: 10,
                                color: "white",
                                fontWeight: "bold",
                                background:
                                  "linear-gradient(45deg,rgb(0, 255, 153), #00b8d4)",
                                "&:hover": {
                                  background:
                                    "linear-gradient(45deg, #00b8d4, #00ffea)",
                                  boxShadow: "0 0 15px rgba(0, 255, 234, 0.8)",
                                },
                                "&:disabled": {
                                  background: "rgba(50, 50, 50, 0.7)",
                                  boxShadow: "none",
                                  cursor: "not-allowed",
                                },
                              }}
                              onClick={renameAlbum}
                            >
                              Применить
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Блок Опасная зона */}
                      <div css={{ position: "relative" }}>
                        <CyberButton
                          label="Опасная зона"
                          hue={0}
                          onClick={() => setShowDanger(!showDanger)}
                        />
                        {showDanger && (
                          <div
                            css={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              marginTop: 10,
                              padding: 8,
                              backgroundColor: "rgba(212, 36, 65, 0.5)",
                              border: "dashed #E8374D",
                              borderRadius: 8,
                              zIndex: 10,
                            }}
                          >
                            <button
                              css={{
                                color: "white",
                                backgroundColor: "#2385B7",
                                "&:hover": {
                                  backgroundColor: "#E14B64",
                                },
                              }}
                              onClick={deleteAlbum}
                            >
                              Удалить альбом
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Кнопка Скачать */}
                      <CyberButton
                        label="Скачать альбом"
                        hue={270}
                        onClick={() => alert("Скачать альбом")}
                      />
                    </div>
                  </div>

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
  navigationItem: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  title: css({
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "2px",
    margin: 0,
    "& > span:first-of-type": {
      color: "white",
    },
    "& > span:last-of-type": {
      color: "#00ffea",
      textShadow:
        "0 0 10px rgba(0, 255, 234, 0.8), 0 0 20px rgba(0, 255, 234, 0.5)",
    },
  }),
  link: css({
    color: "white",
    textDecoration: "none",
    transition: "all 0.3s",
    "&:hover": {
      color: "#00ffea",
      textShadow: "0 0 10px rgba(0, 255, 234, 0.8)",
    },
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
    zIndex: 20,
    pointerEvents: "none",
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
    zIndex: 21,
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
    zIndex: 2,
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
