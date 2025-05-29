import { useState } from "react";
import { AlbumNaming, AlbumForViewPhotos } from "@/app/types/albumTypes";

export const useRenameAlbum = (
  album: AlbumForViewPhotos | null,
  setAlbum: (album: AlbumForViewPhotos | null) => void,
  setShowEdit: (show: boolean) => void
) => {
  const [renameLoading, setRenameLoading] = useState(false);

  const renameAlbum = async (data: AlbumNaming) => {
    if (!data.name || !album?.id) return;

    setRenameLoading(true);

    try {
      const res = await fetch(`/api/albums/${album.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      if (res.ok) {
        const updatedAlbum = await res.json();
        setAlbum({ ...updatedAlbum, photoCount: album.photoCount });
        setShowEdit(false);
      } else {
        throw new Error("Ошибка переименования альбома");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка переименования:", errorMessage);
      alert(`Не удалось переименовать альбом: ${errorMessage}`);
    } finally {
      setRenameLoading(false);
    }
  };

  return { renameAlbum, renameLoading };
};
