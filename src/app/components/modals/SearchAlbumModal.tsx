/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { customFonts } from "../../shared/theme/customFonts";
import { Album } from "@/app/types/albumTypes";

interface SearchAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
  searchTerm: string;
  onPin: () => void;
  includeDescription: boolean;
  onToggleDescription: (value: boolean) => void;
  albums: Album[];
}

/**
 * Модальное окно для поиска альбомов на главной странице на стороне клиента.
 * Цепочка передачи и вызова: AlbumsListContainer -> AlbumsControls && SearchAlbumModal
 * @component
 */
const SearchAlbumModal = ({
  isOpen,
  onClose,
  onSearch,
  searchTerm,
  onPin,
  includeDescription,
  onToggleDescription,
  albums,
}: SearchAlbumModalProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Обновление поискового запроса при вводе
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    onSearch(term);
  };

  const handleClose = () => {
    setLocalSearchTerm("");
    onSearch("");
    onClose();
  };

  if (!isOpen) return null;

  // Фильтрация описаний для отображения (все описания, если галочка включена)
  const descriptions = includeDescription
    ? albums.map((album) => album.description || "Без описания").filter((desc) => desc)
    : [];

  return (
    <div css={styles.modalOverlay} onClick={handleClose}>
      <div css={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div css={styles.modalHeader}>
          <h2 css={styles.modalTitle}>Поиск альбома</h2>
          <button css={styles.closeButton} onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        <div css={styles.searchContainer}>
          <FaSearch css={styles.searchIcon} />
          <input
            type="text"
            placeholder="Введите название альбома..."
            value={localSearchTerm}
            onChange={handleSearch}
            css={styles.searchInput}
          />
        </div>
        <label css={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={includeDescription}
            onChange={(e) => onToggleDescription(e.target.checked)}
            css={styles.checkbox}
          />
          Поиск по описанию
        </label>
        {includeDescription && (
          <div css={styles.descriptionsContainer}>
            <h3 css={styles.descriptionsTitle}>Список описаний:</h3>
            {descriptions.length > 0 ? (
              <ul css={styles.descriptionsList}>
                {descriptions.map((desc, index) => (
                  <li key={index} css={styles.descriptionItem}>
                    {desc}
                  </li>
                ))}
              </ul>
            ) : (
              <p css={styles.noDescriptions}>Нет описаний</p>
            )}
          </div>
        )}
        <div css={styles.buttonItem}>
          <button css={styles.pinButton} onClick={onPin} disabled={!searchTerm}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAlbumModal;

const styles = {
  modalOverlay: css({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }),
  modalContent: css({
    backgroundColor: "var(--modal-background, #142b5c)",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
    color: "white",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  }),
  modalHeader: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  }),
  modalTitle: css({
    fontFamily: customFonts.fonts.ru,
    fontSize: "1.5rem",
    margin: 0,
  }),
  closeButton: css({
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
    "&:hover": {
      color: "#ddd",
    },
  }),
  searchContainer: css({
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    position: "relative",
  }),
  searchIcon: css({
    position: "absolute",
    left: "10px",
    color: "#aaa",
  }),
  searchInput: css({
    width: "100%",
    padding: "8px 8px 8px 30px",
    border: "2px solid var(--create-album-modal-input-fields-border-color-non-target)",
    borderRadius: "5px",
    backgroundColor: "var(--create-album-modal-input-fields-color)",
    color: "white",
    cursor: "pointer",
    fontFamily: customFonts.fonts.ru,
    "&:focus": {
      outline: "none",
      borderColor: "var(--create-album-modal-input-fields-border-color-target)",
    },
  }),
  checkboxLabel: css({
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    color: "white",
    fontFamily: customFonts.fonts.ru,
    fontSize: "1rem",
  }),
  checkbox: css({
    marginRight: "8px",
    cursor: "pointer",
  }),
  descriptionsContainer: css({
    marginBottom: "15px",
    maxHeight: "200px",
    overflowY: "auto",
  }),
  descriptionsTitle: css({
    fontFamily: customFonts.fonts.ru,
    fontSize: "1.2rem",
    margin: "0 0 10px 0",
  }),
  descriptionsList: css({
    listStyle: "none",
    padding: 0,
    margin: 0,
  }),
  descriptionItem: css({
    padding: "5px 0",
    borderBottom: "1px solid #444",
    "&:last-child": {
      borderBottom: "none",
    },
  }),
  noDescriptions: css({
    color: "#aaa",
    textAlign: "center",
    padding: "10px 0",
  }),
  buttonItem: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  }),
  pinButton: css({
    height: 30,
    width: "30%",
    backgroundImage: "var(--create-album-button-color)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "#4a6a8a",
      filter: "brightness(1.15)",
    },
    "&:disabled": {
      backgroundImage: "none",
      backgroundColor: "#666",
      cursor: "not-allowed",
    },
  }),
};
