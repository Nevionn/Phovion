/**
 * Неизменяемые цветовые значения для компонента фото-пикера
 * @typedef {Object} PhotoPickerColors
 * @property {Object} arrowIcon - Цвета для стрелок навигации
 * @property {string} arrowIcon.bright - Яркий цвет стрелок при наведении
 * @property {string} arrowIcon.dim - Тусклый цвет стрелок по умолчанию
 * @property {Object} closeIcon - Цвета для иконки закрытия
 * @property {string} closeIcon.bright - Яркий цвет иконки при наведении
 * @property {string} closeIcon.dim - Тусклый цвет иконки по умолчанию
 * @property {Object} actionButton - Цвета для кнопок действий
 * @property {string} actionButton.bright - Яркий цвет кнопок при наведении
 * @property {string} actionButton.dim - Тусклый цвет кнопок по умолчанию
 * @property {string} photoPosition - Цвет позиции фотографии
 * @property {string} border - Стиль границы
 * @property {string} boxShadow - Стиль тени
 */

const mainColorInterface = "#00ffea";

export const colorIcon = {
  bright: mainColorInterface,
  dim: "#00d1ea",
};

/**
 * Константа с неизменяемыми цветовыми значениями
 * @type {colorConst}
 */

export const colorConst = {
  photoPicker: {
    arrowIcon: {
      bright: colorIcon.bright,
      dim: "#0a9186ad",
    },
    closeIcon: {
      bright: colorIcon.bright,
      dim: colorIcon.dim,
    },
    actionButton: {
      bright: mainColorInterface,
      dim: "rgba(0, 255, 234, 0.2)",
    },
    photoPosition: mainColorInterface,
    border: `1px solid ${mainColorInterface}`,
    boxShadow: "0 0 20px rgba(0, 255, 234, 0.5)",
  },

  movePhotoModal: {
    modalTitle: mainColorInterface,
    border: `1px solid ${mainColorInterface}`,
    icon: {
      closeIcon: {
        bright: colorIcon.bright,
        dim: colorIcon.dim,
      },
      clearIcon: {
        bright: colorIcon.bright,
        dim: colorIcon.dim,
      },
    },

    searchInput: {
      border: `1px solid ${mainColorInterface}`,
      color: mainColorInterface,
      focus: {
        borderColor: "#00d1ea",
        boxShadow: "0 0 5px #00d1ea",
      },
    },
  },

  headerItems: {
    currentAlbumName: mainColorInterface,
    headerContainer: {
      border: `2px solid ${mainColorInterface}`,
    },
    albumNavigationText: {
      textShadow: "0 0 10px rgba(0, 255, 234, 0.8)",
      color: mainColorInterface,
    },
  },
};
