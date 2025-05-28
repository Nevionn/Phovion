/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export default function SkeletonLoader() {
  return (
    <div css={style.skeletonWrapper}>
      <div css={style.skeletonHeader}></div>
      <div css={style.skeletonGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} css={style.skeletonPhoto}></div>
        ))}
      </div>
    </div>
  );
}

const style = {
  skeletonWrapper: css({
    width: "100%",
    maxWidth: "1200px",
    padding: "1rem",
    zIndex: 2,
  }),
  skeletonHeader: css({
    height: "60px",
    width: "80%",
    margin: "0 auto 2rem",
    backgroundColor: "#6A5E5C",
    borderRadius: "8px",
    animation: "pulse 1.5s infinite",
  }),
  skeletonGrid: css({
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    maxWidth: "1200px",
    width: "100%",
  }),
  skeletonPhoto: css({
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: "#6A5E5C",
    borderRadius: "8px",
    animation: "pulse 1.5s infinite",
  }),
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.6 },
    "100%": { opacity: 1 },
  },
};
