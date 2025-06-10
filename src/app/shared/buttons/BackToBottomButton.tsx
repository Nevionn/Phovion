/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { TiArrowDown } from "react-icons/ti";

const BackToBottomButton = () => {
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <button css={styles.backToBottomStyle} onClick={scrollToBottom}>
      <TiArrowDown />
    </button>
  );
};

export default BackToBottomButton;

const styles = {
  backToBottomStyle: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: "40px",
    right: "14px",
    width: "40px",
    height: "40px",
    backgroundImage: "linear-gradient(211deg, #135bc7 0%, #604385 100%)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    padding: 0,
    margin: 0,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "opacity 0.3s, transform 0.3s",
    zIndex: 1000,
    "&:hover": {
      transform: "scale(1.1)",
      filter: "brightness(1.15)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(132, 99, 146, 0.5)",
    },
  }),
};
