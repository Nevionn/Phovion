/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortablePhoto from "./SortablePhoto";
import { Photo } from "../types/photoTypes";

type PhotoGridProps = {
  photos: Photo[];
  onDragEnd: (event: DragEndEvent) => void;
  onPhotoClick: (photo: Photo) => void;
  onDragStart?: (e: React.DragEvent<HTMLImageElement>) => void;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement>) => void;
};

/**
 * Компонент сетка для отображения фотографий текущего альбома.
 * Поддерживает перетаскивание для сортировки и предотвращает нежелательное копирование изображений в буфер обмена.
 * @component
 * @param {PhotoGridProps} props - Свойства компонента.
 * @param {Photo[]} props.photos - Массив фотографий для отображения.
 * @param {function} props.onDragEnd - Обработчик события окончания перетаскивания.
 * @param {function} props.onPhotoClick - Обработчик клика по фото.
 * @param {function} [props.onDragStart] - Необязательный обработчик начала перетаскивания для предотвращения копирования (по умолчанию предотвращает).
 * @param {function} [props.onContextMenu] - Необязательный обработчик контекстного меню для отключения копирования (по умолчанию предотвращает).
 * @returns {JSX.Element}
 */
export default function PhotoGrid({
  photos,
  onDragEnd,
  onPhotoClick,
  onDragStart = (e) => e.preventDefault(),
  onContextMenu = (e) => e.preventDefault(),
}: PhotoGridProps) {
  const photoIds = photos.map((photo) => photo.id);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={photoIds} strategy={rectSortingStrategy}>
        <div css={style.photoGrid}>
          {photos.map((photo) => (
            <SortablePhoto
              key={photo.id}
              photo={photo}
              onClick={() => onPhotoClick(photo)}
              onDragStart={onDragStart}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

const style = {
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
};
