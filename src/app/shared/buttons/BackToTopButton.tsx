/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";

const BackToTopButton = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setShowBackToTop(scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showBackToTop) return null;

  return (
    <button css={styles.backToTopStyle} onClick={scrollToTop}>
      ↑
    </button>
  );
};

export default BackToTopButton;

const styles = {
  backToTopStyle: css({
    position: "fixed",
    bottom: "100px",
    right: "10px",
    width: "50px",
    height: "50px",
    backgroundImage: "linear-gradient(211deg, #135bc7 0%, #604385 100%)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1.5rem",
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
