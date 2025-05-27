/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortablePhoto from "./SortablePhoto";
import { Photo } from "../types/photoTypes";

type PhotoGridProps = {
  photos: Photo[];
  onDragEnd: (event: DragEndEvent) => void;
};

export default function PhotoGrid({ photos, onDragEnd }: PhotoGridProps) {
  const photoIds = photos.map((photo) => photo.id);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={photoIds} strategy={rectSortingStrategy}>
        <div css={style.photoGrid}>
          {photos.map((photo) => (
            <SortablePhoto key={photo.id} photo={photo} />
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
