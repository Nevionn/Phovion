/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SlSizeFullscreen } from "react-icons/sl";
import { Photo } from "../types/photoTypes";

type SortablePhotoProps = {
  photo: Photo;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent<HTMLImageElement>) => void;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement>) => void;
};

/**
 * Компонент фотографии выбранного альбома с функционалом ручной сортировки через DND.
 * Предотвращает нежелательное копирование изображения в буфер обмена при зажатии ЛКМ.
 * Отображает расшиерение изображения "WEBP", "AVIF", "GIF"..
 *
 * @component
 * @param {SortablePhotoProps} props - Свойства компонента.
 * @param {Photo} props.photo - Объект фотографии.
 * @param {function} props.onClick - Обработчик клика по фото.
 * @param {function} [props.onDragStart] - Необязательный обработчик начала перетаскивания для предотвращения копирования (по умолчанию предотвращает).
 * @param {function} [props.onContextMenu] - Необязательный обработчик контекстного меню для отключения копирования (по умолчанию предотвращает).
 * @returns {JSX.Element}
 */

export default function SortablePhoto({
  photo,
  onClick,
  onDragStart = (e) => e.preventDefault(),
  onContextMenu = (e) => e.preventDefault(),
}: SortablePhotoProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
    transition: {
      duration: 150,
      easing: "ease-out",
    },
  });

  const [extensionSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("extensionSettings")!) || {
          enabled: false,
          showStatic: true,
          showAnimated: true,
        }
      );
    } catch {
      return { enabled: false, showStatic: true, showAnimated: true };
    }
  });

  const ext = photo.path.split(".").pop()?.toUpperCase() || "";

  const isStatic = ["JPG", "JPEG", "PNG", "WEBP"].includes(ext);
  const isAnimated = ["GIF", "AVIF", "WEBP"].includes(ext);

  const shouldShow =
    extensionSettings.enabled &&
    ((extensionSettings.showStatic && isStatic) || (extensionSettings.showAnimated && isAnimated));

  const styleDnd = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "none",
    zIndex: isDragging ? 100 : 0,
    boxShadow: isDragging ? "0 8px 16px rgba(0, 0, 0, 0.3)" : "none",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} css={style.photoContainer} style={styleDnd} onClick={onClick}>
      <div
        css={style.dragHandle}
        {...attributes}
        {...listeners} // Перетаскивание только через dragHandle
      >
        <SlSizeFullscreen size={20} />
      </div>

      {shouldShow && (
        <div css={style.extensionLabel}>
          <p>{ext}</p>
        </div>
      )}

      <img
        src={photo.path}
        alt={`Фото ${photo.id}`}
        css={style.photo}
        loading="lazy"
        onDragStart={onDragStart} // Предотвращаем копирование в буфер обмена
        onContextMenu={onContextMenu}
        draggable="false" // Блокируем стандартное перетаскивание изображения
      />
    </div>
  );
}

const style = {
  photoContainer: css({
    position: "relative",
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)",
    },
  }),
  extensionLabel: css({
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "4px 8px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    fontSize: "12px",
    borderRadius: "4px",
    pointerEvents: "none",
    zIndex: 5,
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
