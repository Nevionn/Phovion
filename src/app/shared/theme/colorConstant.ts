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

/**
 * Константа с неизменяемыми цветовыми значениями
 * @type {PhotoPickerColors}
 */

export const colorConst = {
  photoPicker: {
    arrowIcon: {
      bright: "#00ffea",
      dim: "#0a9186ad",
    },
    closeIcon: {
      bright: "#00ffea",
      dim: "#00d1ea",
    },
    actionButton: {
      bright: "#00ffea",
      dim: "rgba(0, 255, 234, 0.2)",
    },
    photoPosition: "#00ffea",
    border: "2px solid #00ffea",
    boxShadow: "0 0 20px rgba(0, 255, 234, 0.5)",
  },
};
