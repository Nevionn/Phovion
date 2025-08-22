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
import PhotoViewer from "./components/modals/PhotoViewer";
import BackToTopButton from "@/app/shared/buttons/BackToTopButton";
import BackToBottomButton from "@/app/shared/buttons/BackToBottomButton";
import HeaderItems from "./components/HeaderItems";
import Description from "./components/Description";
import UploadSection from "./components/UploadSection";
import PhotoGrid from "./components/PhotoGrid";
import DropZoneDragging from "./components/DropZoneDragging";
import SkeletonLoader from "./components/SkeletonLoader";
import { useAlbumData } from "./hooks/useAlbumData";
import { useRenameAlbum } from "./hooks/useRenameAlbum";
import { useDeleteAlbum } from "./hooks/useDeleteAlbum";
import { useClearAlbum } from "./hooks/useClearAlbum";
import { useThemeManager } from "@/app/shared/theme/useThemeManager";
import { useUploadPhotos } from "./hooks/useUploadPhotos";
import { useDownloadAlbum } from "./hooks/useDownloadAlbum";
import { useDropHandler } from "./hooks/useDropHandler";
import { customFonts } from "@/app/shared/theme/customFonts";

const emotionCache = createCache({ key: "css", prepend: true });

const AlbumPage = () => {
  const { id } = useParams();

  const [files, setFiles] = useState<File[]>([]);
  const [triggerUpload, setTriggerUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [showDanger, setShowDanger] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { album, photos, isLoading, setAlbum, setPhotos } = useAlbumData(id);
  const { deleteAlbum } = useDeleteAlbum(id);
  const { clearAlbum } = useClearAlbum(id);
  const { renameAlbum, renameLoading } = useRenameAlbum(
    album,
    setAlbum,
    setShowEdit
  );

  const { uploadPhotos, uploading } = useUploadPhotos(
    id,
    setFiles,
    setPhotos,
    setAlbum,
    fileInputRef
  );

  const { downloadAlbum, isFsaSupported } = useDownloadAlbum({
    photos,
    albumName: album?.name,
    albumId: id,
  });

  const {
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    isDraggingOver,
  } = useDropHandler(isLoading, setFiles, setTriggerUpload);

  useThemeManager();

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

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhotoViewer = () => {
    setSelectedPhoto(null);
  };

  // Вспомогательная функция для общей логики
  const syncAfterPhotoChange = async (photoId: number) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.id !== photoId)
    );
    handleClosePhotoViewer();
    const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
      cache: "no-store",
    });
    if (countRes.ok) {
      const { photoCount } = await countRes.json();
      setAlbum((prev) => (prev ? { ...prev, photoCount } : null));
    }
  };

  const syncAfterPhotoDelete = async (photoId: number) => {
    await syncAfterPhotoChange(photoId);
  };

  const syncAfterPhotoMove = async (photoId: number) => {
    await syncAfterPhotoChange(photoId);
  };

  // Вызов uploadPhotos после обновления состояния
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
                  <HeaderItems
                    album={album}
                    onEditClick={() => setShowEdit(!showEdit)}
                    onDangerClick={() => setShowDanger(!showDanger)}
                    onDownloadClick={downloadAlbum}
                    deleteAlbum={deleteAlbum}
                    clearAlbum={clearAlbum}
                    showDanger={showDanger}
                    photoCount={album?.photoCount || 0}
                    isFsaSupported={isFsaSupported}
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
                <PhotoGrid
                  photos={photos}
                  onDragEnd={handleDragEnd}
                  onPhotoClick={handlePhotoClick}
                  onDragStart={(e) => e.preventDefault()} // Предотвращаем копирование
                  onContextMenu={(e) => e.preventDefault()} // Отключаем контекстное меню
                />
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
        <PhotoViewer
          photo={selectedPhoto}
          photos={photos}
          albumId={Number(id)}
          onClose={handleClosePhotoViewer}
          onSyncAfterPhotoDelete={syncAfterPhotoDelete}
          onSyncAfterPhotoMove={syncAfterPhotoMove}
        />
        <BackToTopButton />
        <BackToBottomButton />
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
    background: "var(--theme-photo-page-background)",
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
    fontFamily: customFonts.fonts.ru,
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
