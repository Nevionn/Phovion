/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { PiMemoryFill } from "react-icons/pi";
import { DecryptedText } from "@/app/shared/DecryptedText";
import { customFonts } from "@/app/shared/theme/customFonts";

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
    <div css={styles.tabSection}>
      <h3 css={styles.sectionTitle}>Системная информация</h3>
      <div css={styles.settingsContainer}>
        <p css={styles.infoItem}>
          <PiMemoryFill /> Вес папки uploads (кеш): <DecryptedText text={uploadFolderSize || "подсчёт.."} speed={30} />
        </p>
      </div>
    </div>
  );
}

const styles = {
  tabSection: css({
    marginBottom: "1.5rem",
    "@media (max-width: 480px)": {
      marginBottom: "1rem",
    },
  }),
  settingsContainer: css({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "@media (max-width: 480px)": {
      gap: "0.8rem",
    },
  }),
  sectionTitle: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "var(--modal-text-color, #00ffea)",
    marginBottom: "0.5rem",
    "@media (max-width: 480px)": {
      fontSize: "1rem",
    },
  }),
  infoItem: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    fontSize: "1rem",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    color: "#ccc",
    "@media (max-width: 480px)": {
      fontSize: "0.9rem",
      gap: 5,
    },
  }),
};
