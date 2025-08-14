import { useState, useEffect } from "react";
import { AlbumForViewPhotos } from "@/app/types/albumTypes";
import { Photo } from "../types/photoTypes";

/**
 * Хук для получения данных о выбранном альбоме (все его фотографии, счетчик фотографий)
 */

export const useAlbumData = (id: string | string[] | undefined) => {
  const [album, setAlbum] = useState<AlbumForViewPhotos | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!id || Array.isArray(id)) {
        if (mounted) setError("Неверный ID альбома");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const albumRes = await fetch(`/api/albums/${id}`, {
          cache: "no-store",
        });
        if (!albumRes.ok)
          throw new Error(`Ошибка загрузки альбома: ${albumRes.statusText}`);
        const { photos: p, ...alb } = await albumRes.json();

        const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
          cache: "no-store",
        });
        if (!countRes.ok)
          throw new Error(
            `Ошибка загрузки количества фотографий: ${countRes.statusText}`
          );
        const { photoCount } = await countRes.json();

        if (mounted) {
          setAlbum({ ...alb, photoCount });
          setPhotos(p || []);
        }
      } catch (err) {
        if (mounted)
          setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const refreshData = async () => {
    if (!id || Array.isArray(id)) {
      setError("Неверный ID альбома");
      return;
    }

    try {
      setIsLoading(true);
      const albumRes = await fetch(`/api/albums/${id}`, { cache: "no-store" });
      if (!albumRes.ok)
        throw new Error(`Ошибка загрузки альбома: ${albumRes.statusText}`);
      const { photos: p, ...alb } = await albumRes.json();

      const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
        cache: "no-store",
      });
      if (!countRes.ok)
        throw new Error(
          `Ошибка загрузки количества фотографий: ${countRes.statusText}`
        );
      const { photoCount } = await countRes.json();

      setAlbum({ ...alb, photoCount });
      setPhotos(p || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    album,
    photos,
    isLoading,
    error,
    setAlbum,
    setPhotos,
    setIsLoading,
    setError,
    refreshData,
  };
};
