export type Theme = "SpaceBlue" | "RoseMoon" | "Solarized" | "OnyxStorm" | "Nord";
import { colorConst } from "./colorConstant";

export const themeColors: Record<
  Theme,
  {
    pages: {
      main: {
        mainGradient: string; // Градиент для главной страницы (список альбомов)
        albumListContainerBorder: string; // Обводка панели альбомов
      };
      photoPage: {
        backgroundColor: string; // Страница выбранного альбома
      };
    };
    modals: {
      settingsModal: {
        settingBoxGradient: string; // Градиент для themeBox в настройках (настройки -> оформление)
        settingBoxBorder: string; // Обводка themeBox
        modalBackground: string; // Фон модального окна
        modalTextColor: string; // Цвет текста в модальном окне
        activeTabButtonColor: string; // Цвет активной кнопки
      };
      createAlbumModal: {
        // работает и для RenameAlbumModal
        inputFieldBg: string;
        inputFieldBorderTarget: string;
        inputFieldBorderNonTarget: string;
      };
      photoViewer: {
        borderColor: string;
        boxShadow: string;
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
        mainGradient: "radial-gradient(150% 100% at 50% 100%, #135bc7 10%, #000814 60%, #041225 100%)",
        albumListContainerBorder: "1px solid rgba(21, 133, 208, 0.94)",
      },
      photoPage: {
        backgroundColor: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #135bc7, #041225)",
        settingBoxBorder: "#00ffea",
        modalBackground: "#142b5c",
        modalTextColor: "#00ffea",
        activeTabButtonColor: "#00ffea39",
      },
      createAlbumModal: {
        inputFieldBg: "rgba(52, 93, 139, 0.4)",
        inputFieldBorderTarget: "rgb(85, 182, 247)",
        inputFieldBorderNonTarget: "rgb(12, 117, 236)",
      },
      photoViewer: {
        borderColor: colorConst.photoPicker.border,
        boxShadow: colorConst.photoPicker.boxShadow,
      },
    },
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor: "linear-gradient(211deg,rgb(47, 101, 152) 0%,rgb(67, 93, 133) 100%)",
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

      photoPage: {
        backgroundColor: "linear-gradient(135deg, #1f1a2eff 0%, #20163eff 50%, #230f60ff 100%)",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, rgb(94, 19, 199), rgb(9, 0, 20))",
        settingBoxBorder: "#ff69b4",
        modalBackground: "#1a1a2e",
        modalTextColor: "white",
        activeTabButtonColor: "#282847ff",
      },
      createAlbumModal: {
        inputFieldBg: "#35355e",
        inputFieldBorderTarget: "rgba(188, 85, 247, 1)",
        inputFieldBorderNonTarget: "rgba(112, 30, 195, 1)",
      },
      photoViewer: {
        borderColor: colorConst.photoPicker.border,
        boxShadow: colorConst.photoPicker.boxShadow,
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
        mainGradient: "radial-gradient(150% 100% at 50% 100%, #073642 10%, #002b36 60%, #001f27 100%)",
        albumListContainerBorder: "1px solid rgba(26, 143, 49, 0.94)",
      },
      photoPage: {
        backgroundColor: "",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #073642, #001f27)",
        settingBoxBorder: "#93a1a1",
        modalBackground: "#002b36",
        modalTextColor: "white",
        activeTabButtonColor: "#00ffea39",
      },
      createAlbumModal: {
        inputFieldBg: "#024e63",
        inputFieldBorderTarget: "",
        inputFieldBorderNonTarget: "",
      },
      photoViewer: {
        borderColor: colorConst.photoPicker.border,
        boxShadow: colorConst.photoPicker.boxShadow,
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
        mainGradient: "radial-gradient(150% 100% at 50% 100%, #282a36 10%, #1e1f29 60%, #14151a 100%)",
        albumListContainerBorder: "1px solid rgba(137, 65, 205, 0.94)",
      },
      photoPage: {
        backgroundColor: "",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #282a36, #14151a)",
        settingBoxBorder: "#bd93f9",
        modalBackground: "#1e1f29",
        modalTextColor: "#bd93f9",
        activeTabButtonColor: "#282847ff",
      },
      createAlbumModal: {
        inputFieldBg: "#323344ff",
        inputFieldBorderTarget: "",
        inputFieldBorderNonTarget: "",
      },
      photoViewer: {
        borderColor: colorConst.photoPicker.border,
        boxShadow: colorConst.photoPicker.boxShadow,
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
        mainGradient: "radial-gradient(150% 100% at 50% 100%, #2e3440 10%, #242931 60%, #1a1f26 100%)",
        albumListContainerBorder: "1px solid rgba(92, 90, 91, 0.94)",
      },
      photoPage: {
        backgroundColor: "",
      },
    },
    modals: {
      settingsModal: {
        settingBoxGradient: "linear-gradient(to right, #2e3440, #1a1f26)",
        settingBoxBorder: "#81a1c1",
        modalBackground: "#242931",
        modalTextColor: "#81a1c1",
        activeTabButtonColor: "#47474f7b",
      },
      createAlbumModal: {
        inputFieldBg: "#3c4350ff",
        inputFieldBorderTarget: "",
        inputFieldBorderNonTarget: "",
      },
      photoViewer: {
        borderColor: colorConst.photoPicker.border,
        boxShadow: colorConst.photoPicker.boxShadow,
      },
    },
    globalButtons: {
      openCreateAlbumModalButton: {
        bgColor: "linear-gradient(211deg, #637492ff 0%, #435885ff 100%)",
      },
    },
  },
};
