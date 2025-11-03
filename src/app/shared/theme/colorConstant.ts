/**
 * Неизменяемые цветовые значения
 */

export const mainColorInterface = "#00ffea";

export const colorIcon = {
  bright: mainColorInterface,
  dim: "#00d1ea",
};

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

    photoPosition: mainColorInterface,
    border: `1px solid ${mainColorInterface}`,
    boxShadow: "0 0 20px rgba(0, 255, 234, 0.5)",
  },

  ActionMenuModal: {
    actionButton: {
      bright: mainColorInterface,
      dim: "rgba(0, 255, 234, 0.2)",
    },
    modalBGcolor: "#20203cff",
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

  settingsModal: {
    designTab: {
      priorityText: "#00ff00",
    },
  },

  albumsControls: {
    iconColor: {
      searchIcon: "#e6e9e9ff",
      settingsIcon: "black",
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
