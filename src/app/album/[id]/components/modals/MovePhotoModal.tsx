/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Album } from "@/app/types/albumTypes";

type MovePhotoModalProps = {
  photoId: number;
  currentAlbumId: number;
  onClose: () => void;
  onMove: (targetAlbumId: number) => void;
};

export default function MovePhotoModal({
  photoId,
  currentAlbumId,
  onClose,
  onMove,
}: MovePhotoModalProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/albums/take", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Ошибка загрузки альбомов");
        }
        const data = await response.json();
        const filteredAlbums = data.filter(
          (album: Album) => album.id !== currentAlbumId
        );
        setAlbums(filteredAlbums);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [currentAlbumId]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleMove = (albumId: number) => {
    onMove(albumId);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (isLoading) return <p css={styles.loading}>Загрузка альбомов...</p>;
  if (error) return <p css={styles.error}>Ошибка: {error}</p>;

  return (
    <div css={styles.modalOverlay} onClick={handleOverlayClick}>
      <div css={styles.modalContent}>
        <span css={styles.closeIcon} onClick={onClose}>
          ×
        </span>
        <h2 css={styles.modalTitle}>Выберите альбом для переноса</h2>
        <div css={styles.grid}>
          {albums.length > 0 ? (
            albums.map((album) => (
              <div
                key={album.id}
                css={styles.albumCard}
                onClick={() => handleMove(album.id)}
              >
                <div css={styles.albumCover}>
                  {album.coverPhotoPath ? (
                    <img
                      src={album.coverPhotoPath}
                      alt={album.name}
                      css={styles.albumImage}
                    />
                  ) : (
                    <div css={styles.placeholder}>Нет обложки</div>
                  )}
                </div>
                <p css={styles.albumName}>{album.name}</p>
              </div>
            ))
          ) : (
            <div css={styles.noAlbumsContainer}>
              <p css={styles.noAlbums}>Нет доступных альбомов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: css({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  }),
  modalContent: css({
    background: "#1a1a2e",
    border: "2px solid #00ffea",
    borderRadius: "12px",
    padding: "1.5rem",
    maxHeight: "80vh",
    overflowY: "auto",
    width: "80%",
    maxWidth: "1200px",
    color: "#fff",
    position: "relative",
  }),
  modalTitle: css({
    fontSize: "1.5rem",
    marginBottom: "1rem",
    textAlign: "center",
    color: "#00ffea",
    fontFamily: "'Orbitron', sans-serif",
  }),
  closeIcon: css({
    position: "absolute",
    top: "1rem",
    right: "1rem",
    fontSize: "1.5rem",
    color: "#00ffea",
    cursor: "pointer",
    "&:hover": {
      color: "#00d1ea",
    },
  }),
  grid: css({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "1rem",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (max-width: 600px)": {
      gridTemplateColumns: "1fr",
    },
  }),
  albumCard: css({
    cursor: "pointer",
    borderRadius: "4px",
    overflow: "hidden",
    position: "relative",
    "&:hover": {
      opacity: 0.9,
    },
  }),
  albumCover: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "300px",
    overflow: "hidden",
  }),
  albumImage: css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }),
  placeholder: css({
    width: "100%",
    height: "100%",
    background: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: "0.9rem",
  }),
  albumName: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "0.5rem",
    textAlign: "center",
    margin: 0,
    fontSize: "1rem",
    background: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    zIndex: 10,
  }),
  closeButton: css({
    display: "none",
  }),
  loading: css({
    color: "#00ffea",
    textAlign: "center",
  }),
  error: css({
    color: "#ff4d4d",
    textAlign: "center",
  }),
  noAlbumsContainer: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gridColumn: "1 / -1",
    height: "300px",
  }),
  noAlbums: css({
    textAlign: "center",
    color: "#888",
  }),
};
