/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { PiMemoryFill } from "react-icons/pi";
import { DecryptedText } from "@/app/shared/DecryptedText";
import { tabsStyles } from "@/app/shared/settingsTabStyles/common";

export default function SystemInfoTab() {
  const [uploadFolderSize, setUploadFolderSize] = useState("подсчёт...");

  useEffect(() => {
    fetch("/api/dirSize")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка HTTP");
        return res.json();
      })
      .then((data) => setUploadFolderSize(data.size || "Неизвестно"))
      .catch(() => setUploadFolderSize("Неизвестно"));
  }, [setUploadFolderSize]);

  return (
    <div css={tabsStyles.tabSection}>
      <h3 css={tabsStyles.sectionTitle}>Системная информация</h3>
      <div css={tabsStyles.settingsContainer}>
        <p css={tabsStyles.infoItem}>
          <PiMemoryFill /> Вес папки uploads (кеш): <DecryptedText text={uploadFolderSize || "подсчёт.."} speed={30} />
        </p>
      </div>
    </div>
  );
}
