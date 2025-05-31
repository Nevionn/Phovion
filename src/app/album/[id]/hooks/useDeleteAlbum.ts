import { useState } from "react";
import { useRouter } from "next/navigation";

export const useDeleteAlbum = (id: string | string[] | undefined) => {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteAlbum = async () => {
    if (!confirm("Удалить альбом?")) return;

    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Ошибка удаления альбома");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      alert(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteAlbum, deleteLoading };
};
