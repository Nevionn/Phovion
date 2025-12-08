/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { customFonts } from "@/app/shared/theme/customFonts";
import { FaGitlab } from "react-icons/fa6";
import { VscGithubInverted } from "react-icons/vsc";
import PhovionImage from "../../../../../../preview/Phovion.webp";
import { tabsStyles } from "@/app/shared/settingsTabStyles/common";

export default function () {
  return (
    <div css={tabsStyles.tabSection}>
      <h3 css={tabsStyles.sectionTitle}>О программе</h3>
      <h1 css={styles.lableText}>
        <img src={PhovionImage.src} alt="Phovion" css={css({ maxWidth: "100%", height: "auto" })} />
      </h1>
      <div css={[tabsStyles.settingsContainer, { gap: 0 }]}>
        <p css={tabsStyles.infoItem}>
          Локальное веб-приложение для создания и управления альбомами с фотографиями. Работает прямо в браузере, не
          требуя серверной инфраструктуры.
        </p>
        <p css={tabsStyles.infoItem}>Разработано Nevionn для удобного хранения и просмотра ваших изображений.</p>
        <p css={tabsStyles.infoItem}>Версия: 1.3.3</p>
        <div css={styles.contactsContainer}>
          <p css={tabsStyles.infoItem}>
            <VscGithubInverted />
            <a href="https://github.com/Nevionn/Phovion" target="_blank" rel="noopener noreferrer" css={styles.link}>
              GitHub
            </a>
          </p>
          <p css={tabsStyles.infoItem}>
            <FaGitlab color="orange" />
            <a href="https://gitlab.com/web4450122/phovion" target="_blank" rel="noopener noreferrer" css={styles.link}>
              GitLab
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  lableText: css({
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    textAlign: "start",
    fontSize: 36,
    margin: 0,
  }),
  contactsContainer: css({
    marginTop: "1rem",
    "@media (max-width: 480px)": {
      marginTop: "0.5rem",
    },
  }),
  link: css({
    color: "#00ffea",
    textDecoration: "none",
    fontFamily: customFonts.fonts.ru,
    letterSpacing: customFonts.fonts.size.ls,
    "&:hover": {
      textDecoration: "underline",
      color: "#00ccaa",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.9rem",
    },
  }),
};
