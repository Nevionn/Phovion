/** @jsxImportSource @emotion/react */
"use client";
import { css, CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import "../../shared/buttons/cyber-button.css";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Photo } from "./types/photoTypes";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import RenameAlbumModal from "@/app/album/[id]/components/modals/RenameAlbumModal";
import BackToTopButton from "@/app/shared/buttons/BackToTopButton";
import Header from "./components/Header";
import Description from "./components/Description";
import UploadSection from "./components/UploadSection";
import PhotoGrid from "./components/PhotoGrid";
import DropZoneDragging from "./components/DropZoneDragging";
import SkeletonLoader from "./components/SkeletonLoader";
import { dataURLtoFile, proxyToFile } from "./utils/utils";
import { useAlbumData } from "./hooks/useAlbumData";
import { useRenameAlbum } from "./hooks/useRenameAlbum";
import { useDeleteAlbum } from "./hooks/useDeleteAlbum";

const emotionCache = createCache({ key: "css", prepend: true });

const AlbumPage = () => {
  const { id } = useParams();

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [showDanger, setShowDanger] = useState(false);

  const { album, photos, isLoading, setAlbum, setPhotos } = useAlbumData(id);
  const { deleteAlbum } = useDeleteAlbum(id);
  const { renameAlbum, renameLoading } = useRenameAlbum(
    album,
    setAlbum,
    setShowEdit
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setTriggerUpload(true);
      } else {
        alert("Перетащите изображение или выберите файлы!");
      }
    }
  };

  // для вызова uploadPhotos после обновления состояния
  useEffect(() => {
    if (triggerUpload && files.length > 0) {
      console.log("Запускаем uploadPhotos с файлами:", files);
      uploadPhotos();
      setTriggerUpload(false);
    }
  }, [triggerUpload, files]);

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
            <SkeletonLoader />
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
          loading={renameLoading}
        />
        <BackToTopButton />
      </main>
    </CacheProvider>
  );
};

export default dynamic(() => Promise.resolve(AlbumPage), {
  ssr: false,
  loading: () => (
    <main css={style.main}>
      <div css={style.contentWrapper}>
        <SkeletonLoader />
      </div>
    </main>
  ),
});

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
  skeletonWrapper: css({
    width: "100%",
    maxWidth: "1200px",
    padding: "1rem",
    zIndex: 2,
  }),
};
