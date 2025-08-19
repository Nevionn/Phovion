/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

/**
 * Компонент модального окна для подтверждения скачивания альбома.
 * Отображает количество фотографий и предоставляет кнопки для принятия или отмены.
 *
 * @param {() => void} props.onAccept - Функция, вызываемая при нажатии кнопки "Принять".
 * @param {() => void} props.onCancel - Функция, вызываемая при нажатии кнопки "Отказаться".
 * @param {number} props.photoCount - Количество фотографий в альбоме.
 */
const DownloadAlbumModal = ({
  onAccept,
  onCancel,
  album,
  photoCount,
  isFsaSupported,
}: {
  onAccept: () => void;
  onCancel: () => void;
  album: string | undefined;
  photoCount: number;
  isFsaSupported: boolean;
}) => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  return (
    <div css={styles.modalOverlay} onClick={onCancel}>
      <div css={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 css={styles.title}>Скачивание альбома - {album}</h2>
        <p css={styles.text}>Будет скачано фотографий: {photoCount}</p>
        <div css={styles.helpSection}>
          {!isFsaSupported && (
            <button
              css={styles.helpButton}
              onClick={() => setIsHelpVisible(!isHelpVisible)}
            >
              Справка
            </button>
          )}
          {isHelpVisible && (
            <p css={styles.helpText}>
              FSA API в данном браузере не поддерживается.
              <br /> Список поддерживаемых браузеров: Edge, Chrome.
              <br /> <span>На скачивание фотографий это никак не влияет.</span>
              <br />
              <br /> Для отключения окна подтверждения при скачивании
              изображений в браузерах семейства Firefox выполните следующие
              настройки в самом браузере:
              <br />
              <br /> Файлы и приложения: Загрузки → Всегда выдавать запрос на
              сохранение файлов (отключить)
              <br />
              <br /> Приложения: Что Firefox должен делать с другими файлами? →
              Сохранять файлы (включить)
            </p>
          )}
        </div>
        <div css={styles.buttonContainer}>
          <button css={styles.button} onClick={onAccept}>
            Скачать
          </button>
          <button css={[styles.button, styles.cancelButton]} onClick={onCancel}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: css({
    position: "fixed",
    top: 300,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }),
  modalContent: css({
    backgroundColor: "var(--modal-background)",
    borderRadius: 8,
    border: "solid 2px #D1D5D4",
    textAlign: "center",
    height: "auto",
    width: 360,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  }),
  title: css({
    fontSize: "1.5rem",
    margin: "0 0 0 0",
    color: "white",
  }),
  text: css({
    fontSize: "1rem",
    color: "var(--modal-text-color)",
  }),
  helpSection: css({
    textAlign: "left",
    marginBottom: 15,
  }),
  helpButton: css({
    fontSize: "0.9rem",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "white",
    marginBottom: 5,
    "&:hover": {
      opacity: 0.8,
    },
  }),
  helpText: css({
    fontSize: 17,
    fontFamily: "monospace",
    marginBottom: 0,
    color: "#5c5b5b",
    padding: "10px",
    backgroundColor: "#f0e7c4ff",
    borderRadius: 4,

    "br:nth-of-type(2) + span": {
      color: "#1ea24eff",
    },
  }),
  buttonContainer: css({
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
  }),
  button: css({
    padding: "8px 16px",
    fontSize: "1rem",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    color: "white",
    backgroundColor: "#5cccb4ff",
    "&:hover": {
      backgroundColor: "#439987ff",
    },
  }),
  cancelButton: css({
    backgroundColor: "#f44336",
    "&:hover": {
      backgroundColor: "#da190b",
    },
  }),
};

export default DownloadAlbumModal;
