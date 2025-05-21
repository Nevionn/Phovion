/** @jsxImportSource @emotion/react */
"use client";
import "./globals.css";
import AlbumsListContainer from "./components/AlbumsListContainer";

export default function Home() {
  return (
    <main>
      <AlbumsListContainer />
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
