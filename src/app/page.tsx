/** @jsxImportSource @emotion/react */
"use client";
import "./globals.css";
import AlbumListContainer from "./components/AlbumListContainer";

export default function Home() {
  return (
    <main>
      <AlbumListContainer />
    </main>
  );
}

// mainStyleGeneral: css({
//   display: "flex",
//   alignItems: "center",
//   flexDirection: "column",
//   minHeight: "100vh",
//   width: "60%",
//   padding: "2rem",
//   margin: "0 auto",
//   marginTop: 14,
//   backgroundColor: "#1b1c2e",
// }),
