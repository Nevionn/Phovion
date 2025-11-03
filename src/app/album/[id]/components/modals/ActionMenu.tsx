/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TbPhoto, TbRotate2, TbArrowBigRight, TbDownload } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import Separator from "@/app/shared/separator/Separator";
import { colorConst } from "@/app/shared/theme/colorConstant";

interface ActionMenuProps {
  isDeleting: boolean;
  onEdit: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onMove: () => void;
  onSetCover: () => void;
  onOpenOriginal: () => void;
  onDelete: () => void;
}

/**
 * Компонент всплывающего меню действий для фотографий (ActionMenu).
 *
 * Используется в интерфейсе просмотра фотографий для вызова различных действий:
 * редактирования, поворота, перемещения, установки обложки, открытия оригинала и удаления.
 *
 * Меню открывается при наведении курсора на кнопку «Действия» и располагается над ней по центру.
 * Закрывается с небольшой задержкой, если курсор уходит с кнопки или меню.
 *
 * При активном процессе удаления кнопка «Удалить» становится неактивной и отображает статус «Удаление...».
 *
 * @component
 * @example
 * ```tsx
 * <ActionMenu
 *   isDeleting={isDeleting}
 *   onEdit={() => setIsEditModalOpen(true)}
 *   onRotateLeft={rotateLeftHandler}
 *   onRotateRight={rotateRightHandler}
 *   onMove={() => setIsMoveModalOpen(true)}
 *   onSetCover={handleSetCover}
 *   onOpenOriginal={() => handleExpand(currentPhoto)}
 *   onDelete={handleDelete}
 * />
 * ```
 *
 * @param {Object} props — Свойства компонента.
 * @param {boolean} props.isDeleting — Флаг состояния удаления. Если `true`, пункт меню «Удалить» неактивен и показывает «Удаление...».
 * @param {Function} props.onEdit — Обработчик открытия фоторедактора.
 * @param {Function} props.onRotateLeft — Обработчик поворота изображения влево.
 * @param {Function} props.onRotateRight — Обработчик поворота изображения вправо.
 * @param {Function} props.onMove — Обработчик перемещения изображения в другой альбом.
 * @param {Function} props.onSetCover — Обработчик установки изображения как обложки альбома.
 * @param {Function} props.onOpenOriginal — Обработчик открытия оригинального изображения.
 * @param {Function} props.onDelete — Обработчик удаления изображения. Перед удалением показывается диалог подтверждения.
 *
 * @returns {JSX.Element} Кнопка открытия меню и само всплывающее меню с пунктами действий.
 */

const ActionMenu: React.FC<ActionMenuProps> = ({
  isDeleting,
  onEdit,
  onRotateLeft,
  onRotateRight,
  onMove,
  onSetCover,
  onOpenOriginal,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Центрируем меню и стрелку над кнопкой
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 240;
      const menuWidth = 200;

      setPosition({
        top: rect.top - menuHeight - 10,
        left: rect.left + rect.width / 2 - menuWidth / 2,
      });
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setIsOpen(false), 180);
  };

  const handleClick = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    if (isDeleting) return;
    if (confirm("Вы уверены, что хотите удалить эту фотографию?")) {
      handleClick(onDelete);
    }
  };

  return (
    <>
      <button ref={buttonRef} css={styles.button} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Действия ▾
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            id="custom-action-menu"
            css={styles.popup(position)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div css={styles.arrow} />

            <div css={styles.item} onClick={() => handleClick(onEdit)}>
              <FaPhotoVideo css={styles.icon} /> Фоторедактор
            </div>
            <div css={styles.item} onClick={() => handleClick(onRotateLeft)}>
              <TbRotate2 css={styles.icon} /> Повернуть влево
            </div>
            <div css={styles.item} onClick={() => handleClick(onRotateRight)}>
              <TbRotate2 css={styles.icon} style={{ transform: "scaleX(-1)" }} /> Повернуть вправо
            </div>

            <Separator css={styles.separator} />

            <div css={styles.item} onClick={() => handleClick(onMove)}>
              <TbArrowBigRight css={styles.icon} /> Перенести в альбом
            </div>
            <div css={styles.item} onClick={() => handleClick(onSetCover)}>
              <TbPhoto css={styles.icon} /> Сделать обложкой альбома
            </div>
            <div css={styles.item} onClick={() => handleClick(onOpenOriginal)}>
              <TbDownload css={styles.icon} /> Открыть оригинал
            </div>

            <Separator css={styles.separator} />

            <div css={[styles.item, isDeleting && styles.disabledItem]} onClick={handleDeleteClick}>
              <MdDeleteForever css={styles.icon} />
              {isDeleting ? "Удаление..." : "Удалить"}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ActionMenu;

const styles = {
  button: css({
    backgroundColor: "transparent",
    color: colorConst.photoPicker.photoPosition,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "color 0.2s ease",
    "&:hover": { color: "#fff" },
  }),
  popup: (pos: { top: number; left: number }) =>
    css({
      position: "fixed",
      top: `${pos.top}px`,
      left: `${pos.left}px`,
      background: colorConst.ActionMenuModal.modalBGcolor,
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "6px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
      padding: "6px 0",
      minWidth: "200px",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      animation: "fadeIn 0.15s ease-out",
      "@keyframes fadeIn": {
        from: { opacity: 0, transform: "translateY(6px)" },
        to: { opacity: 1, transform: "translateY(0)" },
      },
    }),
  arrow: css({
    position: "absolute",
    bottom: "-6px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "6px solid #2a2a2a",
  }),
  item: css({
    color: "#fff",
    padding: "6px 12px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background 0.15s ease, color 0.2s ease",
    "&:hover": { background: "rgba(255,255,255,0.1)" },
  }),
  disabledItem: css({
    opacity: 0.5,
    pointerEvents: "none",
  }),
  separator: css({
    height: "1px",
    background: "rgba(255,255,255,0.15)",
    margin: "4px 0",
  }),
  icon: css({
    opacity: 0.8,
    fontSize: "16px",
  }),
};
