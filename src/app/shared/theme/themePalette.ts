export type Theme =
  | "SpaceBlue"
  | "RoseMoon"
  | "Solarized"
  | "OnyxStorm"
  | "Nord";

export const themeColors: Record<
  Theme,
  {
    mainGradient: string; // Градиент для главной страницы (список альбомов)
    albumListContainerBorder: string; // Обводка панели альбомов
    settingBoxGradient: string; // Градиент для themeBox в настройках (настройки -> оформление)
    settingBoxBorder: string; // Обводка themeBox
    modalBackground: string; // Фон модального окна
    modalTextColor: string; // Цвет текста в модальном окне
  }
> = {
  SpaceBlue: {
    mainGradient:
      "radial-gradient(150% 100% at 50% 100%, #135bc7 10%, #000814 60%, #041225 100%)",
    albumListContainerBorder: "1px solid rgba(21, 133, 208, 0.94)",
    settingBoxGradient: "linear-gradient(to right, #135bc7, #041225)",
    settingBoxBorder: "#00ffea",
    modalBackground: "#142b5c", // Тёмно-синий фон для модального окна
    modalTextColor: "#00ffea", // Яркий текст для контраста
  },
  RoseMoon: {
    mainGradient:
      "radial-gradient(150% 100% at 50% 100%, rgb(94, 19, 199) 10%, rgb(17, 4, 37) 60%, rgb(9, 0, 20) 100%)",
    albumListContainerBorder: "1px solid rgba(202, 21, 208, 0.94)",
    settingBoxGradient:
      "linear-gradient(to right, rgb(94, 19, 199), rgb(9, 0, 20))",
    settingBoxBorder: "#ff69b4",
    modalBackground: "#1a1a2e", // Тёмно-фиолетовый фон
    modalTextColor: "white",
  },
  Solarized: {
    mainGradient:
      "radial-gradient(150% 100% at 50% 100%, #073642 10%, #002b36 60%, #001f27 100%)",
    albumListContainerBorder: "1px solid rgba(26, 143, 49, 0.94)",
    settingBoxGradient: "linear-gradient(to right, #073642, #001f27)",
    settingBoxBorder: "#93a1a1",
    modalBackground: "#002b36", // Тёмно-зелёный фон
    modalTextColor: "white",
  },
  OnyxStorm: {
    mainGradient:
      "radial-gradient(150% 100% at 50% 100%, #282a36 10%, #1e1f29 60%, #14151a 100%)",
    albumListContainerBorder: "1px solid rgba(137, 65, 205, 0.94)",
    settingBoxGradient: "linear-gradient(to right, #282a36, #14151a)",
    settingBoxBorder: "#bd93f9",
    modalBackground: "#1e1f29", // Тёмно-серый фон
    modalTextColor: "#bd93f9", // Фиолетовый текст
  },
  Nord: {
    mainGradient:
      "radial-gradient(150% 100% at 50% 100%, #2e3440 10%, #242931 60%, #1a1f26 100%)",
    albumListContainerBorder: "1px solid rgba(92, 90, 91, 0.94)",
    settingBoxGradient: "linear-gradient(to right, #2e3440, #1a1f26)",
    settingBoxBorder: "#81a1c1",
    modalBackground: "#242931", // Тёмно-синий фон
    modalTextColor: "#81a1c1", // Голубой текст
  },
};
