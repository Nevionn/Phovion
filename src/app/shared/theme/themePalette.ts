export type Theme =
  | "SpaceBlue"
  | "RoseMoon"
  | "Solarized"
  | "OnyxStorm"
  | "Nord";

export const themeColors: Record<
  Theme,
  {
    pages: {
      main: {
        mainGradient: string; // Градиент для главной страницы (список альбомов)
        albumListContainerBorder: string; // Обводка панели альбомов
      };
      // Страница фотографий todo
    };
    modals: {
      settingsModal: {
        settingBoxGradient: string; // Градиент для themeBox в настройках (настройки -> оформление)
        settingBoxBorder: string; // Обводка themeBox
        modalBackground: string; // Фон модального окна
        modalTextColor: string; // Цвет текста в модальном окне
      };
      createAlbumModal: {
        // работает и для RenameAlbumModal
        inputFieldBg: string;
        inputFieldBorderTarget: string;
        inputFieldBorderNonTarget: string;
      };
    };
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor: string; // общий цвет и для кнопки "создать" внутри компонента CreateAlbumModal
      };
    };
  }
> = {
  SpaceBlue: {
    pages: {
      main: {
        mainGradient:
          "radial-gradient(150% 100% at 50% 100%, #135bc7 10%, #000814 60%, #041225 100%)",
        albumListContainerBorder: "1px solid rgba(21, 133, 208, 0.94)",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #135bc7, #041225)",
        settingBoxBorder: "#00ffea",
        modalBackground: "#142b5c",
        modalTextColor: "#00ffea",
      },
      createAlbumModal: {
        inputFieldBg: "rgba(52, 93, 139, 0.4)",
        inputFieldBorderTarget: "rgb(85, 182, 247)",
        inputFieldBorderNonTarget: "rgb(12, 117, 236)",
      },
    },
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor:
          "linear-gradient(211deg,rgb(47, 101, 152) 0%,rgb(67, 93, 133) 100%)",
      },
    },
  },
  RoseMoon: {
    pages: {
      main: {
        mainGradient:
          "radial-gradient(150% 100% at 50% 100%, rgb(94, 19, 199) 10%, rgb(17, 4, 37) 60%, rgb(9, 0, 20) 100%)",
        albumListContainerBorder: "1px solid rgba(202, 21, 208, 0.94)",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient:
          "linear-gradient(to right, rgb(94, 19, 199), rgb(9, 0, 20))",
        settingBoxBorder: "#ff69b4",
        modalBackground: "#1a1a2e",
        modalTextColor: "white",
      },
      createAlbumModal: {
        inputFieldBg: "#35355e",
        inputFieldBorderTarget: "rgba(188, 85, 247, 1)",
        inputFieldBorderNonTarget: "rgba(112, 30, 195, 1)",
      },
    },
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor: "linear-gradient(211deg, #846392 0%, #604385 100%)",
      },
    },
  },
  Solarized: {
    pages: {
      main: {
        mainGradient:
          "radial-gradient(150% 100% at 50% 100%, #073642 10%, #002b36 60%, #001f27 100%)",
        albumListContainerBorder: "1px solid rgba(26, 143, 49, 0.94)",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #073642, #001f27)",
        settingBoxBorder: "#93a1a1",
        modalBackground: "#002b36",
        modalTextColor: "white",
      },
      createAlbumModal: {
        inputFieldBg: "#024e63",
        inputFieldBorderTarget: "",
        inputFieldBorderNonTarget: "",
      },
    },
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor: "linear-gradient(211deg, #638592ff 0%, #438569ff 100%)",
      },
    },
  },
  OnyxStorm: {
    pages: {
      main: {
        mainGradient:
          "radial-gradient(150% 100% at 50% 100%, #282a36 10%, #1e1f29 60%, #14151a 100%)",
        albumListContainerBorder: "1px solid rgba(137, 65, 205, 0.94)",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #282a36, #14151a)",
        settingBoxBorder: "#bd93f9",
        modalBackground: "#1e1f29",
        modalTextColor: "#bd93f9",
      },
      createAlbumModal: {
        inputFieldBg: "#323344ff",
        inputFieldBorderTarget: "",
        inputFieldBorderNonTarget: "",
      },
    },
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor: "linear-gradient(211deg, #444b4eff 0%, #6a887cff 100%)",
      },
    },
  },
  Nord: {
    pages: {
      main: {
        mainGradient:
          "radial-gradient(150% 100% at 50% 100%, #2e3440 10%, #242931 60%, #1a1f26 100%)",
        albumListContainerBorder: "1px solid rgba(92, 90, 91, 0.94)",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #2e3440, #1a1f26)",
        settingBoxBorder: "#81a1c1",
        modalBackground: "#242931",
        modalTextColor: "#81a1c1",
      },
      createAlbumModal: {
        inputFieldBg: "#3c4350ff",
        inputFieldBorderTarget: "",
        inputFieldBorderNonTarget: "",
      },
    },
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor: "linear-gradient(211deg, #637492ff 0%, #435885ff 100%)",
      },
    },
  },
};
