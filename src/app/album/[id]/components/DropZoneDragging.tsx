/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FaCloudUploadAlt } from "react-icons/fa";

type DropZoneDraggingProps = {
  isDraggingOver: boolean;
  isLoading: boolean;
};

export default function DropZoneDragging({
  isDraggingOver,
  isLoading,
}: DropZoneDraggingProps) {
  if (!isDraggingOver || isLoading) return null;

  return (
    <div css={style.dropZoneDragging}>
      <div css={style.dragOverlay}>
        <FaCloudUploadAlt size={80} />
        <span>Загрузить фотографии</span>
      </div>
    </div>
  );
}

const style = {
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
};
