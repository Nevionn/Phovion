/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import { useState } from "react";
import { UI_PASS } from "../../../passconfig";
import { customFonts } from "../shared/theme/customFonts";
import { useRouter } from "next/navigation";

/**
 * Компонент авторизации, используется только пароль
 */

export const LoginBoard = () => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = () => {
    if (value !== UI_PASS) {
      setError("Неверный пароль");
      return;
    }

    setError(null);
    router.replace("/albumsPage");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (error) setError(null);
  };

  const isActive = focused || value.length > 0;

  return (
    <div css={styles.root}>
      <div css={styles.panel}>
        <div css={styles.field}>
          <label css={[styles.label, isActive && styles.labelActive]}>Введите пароль</label>

          <input
            css={[styles.input, error && styles.inputError]}
            type="password"
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>

        {error && <div css={styles.errorText}>{error}</div>}

        <button css={styles.button} onClick={handleSubmit}>
          Войти
        </button>
      </div>
    </div>
  );
};

const styles = {
  root: css({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "",
  }),
  panel: css({
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#413a7dff",
    minWidth: "280px",
  }),
  field: css({
    position: "relative",
    marginBottom: "12px",
  }),
  label: css({
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: customFonts.fonts.size.md,
    fontFamily: customFonts.fonts.ru,
    color: "#2c2a2aff",
    pointerEvents: "none",
    backgroundColor: "#fff",
    padding: "0 4px",
    transition: "all 0.2s ease",
    borderRadius: "4px",
    border: "1px solid transparent",
  }),
  labelActive: css({
    top: "1px",
    fontSize: "16px",
    color: "#464545ff",
    borderColor: "#2daddcff",
  }),
  input: css({
    width: "100%",
    padding: "12px 10px 8px",
    fontSize: customFonts.fonts.size.inputText,
    borderRadius: "4px",
    border: "1px solid #222",
    outline: "none",
    boxSizing: "border-box",

    "&:focus": {
      borderColor: "#2daddcff",
    },
  }),
  button: css({
    marginTop: "12px",
    width: "100%",
    padding: "8px",
    fontSize: customFonts.fonts.size.subTitle,
    fontFamily: customFonts.fonts.ru,
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#222",
    color: "#fff",
  }),
  inputError: css({
    borderColor: "#ff4d4f",

    "&:focus": {
      borderColor: "#ff4d4f",
    },
  }),
  errorText: css({
    marginTop: "6px",
    marginBottom: "4px",
    fontSize: "13px",
    color: "#ffb3b3",
    fontFamily: customFonts.fonts.ru,
  }),
};
