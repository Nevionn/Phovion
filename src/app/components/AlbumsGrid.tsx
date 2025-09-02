/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SlSizeFullscreen } from "react-icons/sl";
import { Album } from "../types/albumTypes";
import { customFonts } from "../shared/theme/customFonts";

interface SortableAlbumProps {
  album: Album;
  onClick: () => void;
  onMiddleClick: (e: React.MouseEvent) => void;
}

const SortableAlbum = ({ album, onClick, onMiddleClick }: SortableAlbumProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
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
    <div ref={setNodeRef} css={styles.albumCardStyle} style={style} onClick={onClick} onMouseDown={onMiddleClick}>
      <div css={styles.dragHandleStyle} {...attributes} {...listeners}>
        <SlSizeFullscreen size={24} />
      </div>
      {album.coverPhotoPath ? (
        <>
          <img src={album.coverPhotoPath} alt={album.name} css={styles.albumAvatarStyle} loading="lazy" />
          <p css={styles.titleCardAlbumStyle}>
            <span>{album.name}</span>
            <span>{album.photoCount ?? 0}</span>
          </p>
        </>
      ) : (
        <div css={styles.albumPlaceholderStyle}>
          <p css={styles.titleCardAlbumStyle}>
            <span>{album.name}</span>
            <span>{album.photoCount ?? 0}</span>
          </p>
          <span css={styles.placeholderTextStyle}>Нет фото</span>
        </div>
      )}
    </div>
  );
};

interface AlbumsGridProps {
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
}

/**
 * Компонент сетка всех альбомов на главной странице, с функцией сортировки dnd
 *
 * @returns {jsx.component}
 */

const AlbumsGrid = ({ albums, setAlbums }: AlbumsGridProps) => {
  const router = useRouter();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAlbums((prevAlbums: Album[]) => {
        const oldIndex = prevAlbums.findIndex((album: Album) => album.id === active.id);
        const newIndex = prevAlbums.findIndex((album: Album) => album.id === over?.id);

        const newAlbums = arrayMove(prevAlbums, oldIndex, newIndex);

        const updatedOrder = newAlbums.map((album: Album, index: number) => ({
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

  const albumIds = useMemo(() => albums.map((album: Album) => album.id), [albums]);

  const handleAlbumClick = (albumId: number) => {
    // Сохраняем позицию прокрутки перед переходом
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    router.push(`/album/${albumId}`);
  };

  const handleMiddleClick = (e: React.MouseEvent, albumId: number) => {
    if (e.button === 1) {
      e.preventDefault();
      window.open(`/album/${albumId}`, "_blank");
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={albumIds} strategy={rectSortingStrategy}>
        <div css={styles.albumListStyle}>
          {albums.map((album: Album) => (
            <SortableAlbum
              key={album.id}
              album={album}
              onClick={() => handleAlbumClick(album.id)}
              onMiddleClick={(e) => handleMiddleClick(e, album.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default AlbumsGrid;

const styles = {
  albumListStyle: css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    padding: "1rem 0",
  }),
  albumCardStyle: css({
    position: "relative",
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
    fontFamily: customFonts.fonts.ru,
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
    fontFamily: customFonts.fonts.ru,
    fontSize: "0.9rem",
    color: "#666",
    marginTop: "0.5rem",
  }),
};
