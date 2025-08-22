/**
 * Открывает фотографию в новой вкладке с динамическим режимом отображения.
 * @param currentPhoto Текущая фотография с полем path.
 * @returns {void}
 */

export const handleExpand = (currentPhoto: { path: string } | null) => {
  if (!currentPhoto) return;

  const fullScreenUrl = `${currentPhoto.path}`;
  const win = window.open(fullScreenUrl, "_blank");
  if (win) {
    const fitMode =
      typeof window !== "undefined"
        ? localStorage.getItem("imageFitMode") || "contain"
        : "contain";
    let styleContent = `
      body { margin: 0; padding: 0; background-color: black; }
      img { width: 100%; height: auto; object-fit: ${fitMode}; display: block; }
    `;
    if (fitMode === "contain") {
      styleContent += `
        html, body { height: 100%; overflow: auto; }
        img { max-width: 100%; max-height: 100%; }
      `;
    } else if (fitMode === "fill") {
      styleContent += `
        html, body { height: auto; overflow: auto; }
        img { min-width: 100vw; min-height: 100vh; }
      `;
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${styleContent}
          </style>
        </head>
        <body>
          <img src="${currentPhoto.path}" alt="Full Screen Photo">
        </body>
      </html>
    `);
    win.document.close();
  }
};
