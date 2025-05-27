/** @jsxImportSource @emotion/react */
"use client";
import { css, CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import "../../shared/buttons/cyber-button.css";
import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Photo } from "./types/photoTypes";
import { AlbumNaming, AlbumForViewPhotos } from "@/app/types/albumTypes";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import RenameAlbumModal from "@/app/album/[id]/components/modals/RenameAlbumModal";
import BackToTopButton from "@/app/shared/buttons/BackToTopButton";
import Header from "./components/Header";
import Description from "./components/Description";
import UploadSection from "./components/UploadSection";
import PhotoGrid from "./components/PhotoGrid";
import DropZoneDragging from "./components/DropZoneDragging";
import { dataURLtoFile, proxyToFile } from "./utils/utils";

const emotionCache = createCache({ key: "css", prepend: true });

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
  const [showDanger, setShowDanger] = useState(false);

  // Ссылка на инпут для сброса значения
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Запрос данных альбома
        const albumRes = await fetch(`/api/albums/${id}`, {
          cache: "no-store",
        });
        if (!albumRes.ok) {
          throw new Error(`Ошибка загрузки альбома: ${albumRes.statusText}`);
        }
        const { photos: p, ...alb } = await albumRes.json();
        console.log("Загруженные данные альбома:", { album: alb, photos: p });

        // Запрос количества фотографий для альбома
        const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
          cache: "no-store",
        });
        if (!countRes.ok) {
          throw new Error(
            `Ошибка загрузки количества фотографий: ${countRes.statusText}`
          );
        }
        const { photoCount } = await countRes.json();
        console.log("Количество фотографий:", photoCount);

        setAlbum({ ...alb, photoCount });
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
    if (files.length === 0) {
      console.log("Нет файлов для загрузки.");
      return;
    }
    setUploading(true);

    console.log("Начинаем загрузку файлов:", files);

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
        setFiles([]); // Очищаем буфер после успешной загрузки
        setPhotos((prev) => [...prev, ...newPhotos]); // Обновляем список фотографий

        // Сбрасываем значение инпута
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          console.log("ИНПУТ СБРОШЕН");
        }

        // Обновляем photoCount после загрузки
        const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
          cache: "no-store",
        });
        if (countRes.ok) {
          const { photoCount } = await countRes.json();
          setAlbum((prev) => (prev ? { ...prev, photoCount } : null));
        } else {
          throw new Error(
            `Ошибка обновления количества фотографий: ${countRes.statusText}`
          );
        }
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

  async function renameAlbum(data: AlbumNaming) {
    if (!data.name || !album?.id) return;

    try {
      const res = await fetch(`/api/albums/${album.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      if (res.ok) {
        const updatedAlbum = await res.json();
        setAlbum({ ...updatedAlbum, photoCount: album.photoCount });
        setShowEdit(false);
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
        // Обновляем photoCount
        const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
          cache: "no-store",
        });
        if (countRes.ok) {
          const { photoCount } = await countRes.json();
          setAlbum({ ...updatedAlbum, photoCount });
        }
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
        // Обновляем photoCount
        const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
          cache: "no-store",
        });
        if (countRes.ok) {
          const { photoCount } = await countRes.json();
          setAlbum({ ...alb, photoCount });
        }
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

  const [triggerUpload, setTriggerUpload] = useState(false);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDraggingOver(false);

      const droppedFiles: Set<File> = new Set();

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
      const url = uriList || plainText;
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
      console.log("Итоговый список файлов для загрузки:", finalFiles);

      // Очищаем и устанавливаем новые файлы
      setFiles(finalFiles);
      console.log("Текущее состояние files перед триггером:", files);
      if (finalFiles.length > 0) {
        setTriggerUpload(true); // Активируем триггер для загрузки
      } else {
        alert("Перетащите изображение или выберите файлы!");
      }
    }
  };

  // useEffect для вызова uploadPhotos после обновления состояния
  useEffect(() => {
    if (triggerUpload && files.length > 0) {
      console.log("Запускаем uploadPhotos с файлами:", files);
      uploadPhotos();
      setTriggerUpload(false);
    }
  }, [triggerUpload, files]);

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
                  <Header
                    album={album}
                    onEditClick={() => setShowEdit(!showEdit)}
                    onDangerClick={() => setShowDanger(!showDanger)}
                    onDownloadClick={() => alert("Скачать альбом")}
                    deleteAlbum={deleteAlbum}
                    showDanger={showDanger}
                  />
                  <Description description={album.description} />
                  <UploadSection
                    files={files}
                    uploading={uploading}
                    uploadPhotos={uploadPhotos}
                    setFiles={setFiles}
                  />
                </div>
              </div>
              {photos.length === 0 ? (
                <p css={style.loadingText}>
                  Перетащите изображения сюда или выберите файлы
                </p>
              ) : (
                <PhotoGrid photos={photos} onDragEnd={handleDragEnd} />
              )}
            </>
          ) : (
            <p css={style.loadingText}>Ошибка загрузки альбома</p>
          )}
          <DropZoneDragging
            isDraggingOver={isDraggingOver}
            isLoading={isLoading}
          />
        </div>
        <RenameAlbumModal
          isOpen={showEdit}
          currentName={album?.name || ""}
          currentDescription={album?.description || null}
          renameAlbum={renameAlbum}
          onClose={() => setShowEdit(false)}
          loading={false}
        />
        <BackToTopButton />
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
