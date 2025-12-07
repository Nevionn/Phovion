/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import AppearanceTab from "./tabs/AppearanceTab/AppearanceTab";
import SystemInfoTab from "./tabs/SystemInfoTab";
import BehaviorTab from "./tabs/BehaviorTab";
import HotkeysTab from "./tabs/HotkeysTab";
import AboutTab from "./tabs/AboutTab";
import DangerZoneTab from "./tabs/DangerZoneTab";

type TabContentProps = {
  activeTab: string;
  onClose: () => void;
  deleteAllAlbums: () => Promise<void>;
  albumCount: number;
  loading?: boolean;
};

/**
 * Компонент хаб, содержащий в себе вложенные компоненты табов
 */

export default function TabContent({ activeTab, onClose, deleteAllAlbums, albumCount, loading }: TabContentProps) {
  return (
    <div css={style.tabContent}>
      {activeTab === "Оформление" && <AppearanceTab />}

      {activeTab === "Системная информация" && <SystemInfoTab />}

      {activeTab === "Поведение" && <BehaviorTab />}

      {activeTab === "Горячие клавиши" && <HotkeysTab />}

      {activeTab === "О программе" && <AboutTab />}

      {activeTab === "Опасная зона" && (
        <DangerZoneTab onClose={onClose} deleteAllAlbums={deleteAllAlbums} albumCount={albumCount} loading={loading} />
      )}
    </div>
  );
}

const style = {
  tabContent: css({
    width: "70%", // 2/3 ширины
    padding: "1rem",
    overflowY: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    msOverflowStyle: "none", // Edge не поддерживает стилизацию

    "@media (max-width: 768px)": {
      width: "100%",
      padding: "0.8rem",
    },
  }),
};
