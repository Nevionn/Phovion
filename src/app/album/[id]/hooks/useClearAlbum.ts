import { useState } from "react";
import { useRouter } from "next/navigation";

export const useClearAlbum = (id: string | string[] | undefined) => {
  const router = useRouter();
  const [clearLoading, setClearLoading] = useState(false);

  const clearAlbum = async () => {
    if (!confirm("Очистить альбом (удалить все фотографии)?")) return;

    setClearLoading(true);

    try {
      const res = await fetch(`/api/albums/clear/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        throw new Error("Ошибка очистки альбома");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      alert(errorMessage);
    } finally {
      setClearLoading(false);
    }
  };

  return { clearAlbum, clearLoading };
};
