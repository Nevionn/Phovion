/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState, useRef } from "react";

interface DecryptedTextProps {
  text: string | undefined;
  speed?: number; // Скорость анимации в мс
  className?: string;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  className = "",
}) => {
  const [displayText, setDisplayText] = useState("");
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const safeText = typeof text === "string" ? text : "";

    const scrambleText = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const newDisplayText = safeText
        .split("")
        .map((char, index) => {
          if (revealedIndices.includes(index)) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      setDisplayText(newDisplayText);
    };

    const revealText = () => {
      interval = setInterval(() => {
        setRevealedIndices((prev) => {
          const nextIndex = prev.length;
          if (nextIndex < safeText.length) {
            const newIndices = [...prev, nextIndex];
            scrambleText();
            return newIndices;
          } else {
            clearInterval(interval);
            setDisplayText(safeText);
            return prev;
          }
        });
      }, speed);
    };

    if (containerRef.current && safeText) {
      revealText();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <span ref={containerRef} css={styles.wrapper} className={className}>
      {displayText.split("").map((char, index) => (
        <span key={index} css={styles.char}>
          {char}
        </span>
      ))}
    </span>
  );
};

const styles = {
  wrapper: css({
    display: "inline-block",
    whiteSpace: "pre-wrap",
  }),
  char: css({
    display: "inline-block",
  }),
};
