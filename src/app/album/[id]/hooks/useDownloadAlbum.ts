import { useCallback } from "react";
import type { Photo } from "../types/photoTypes";

interface DownloadAlbumParams {
	photos: Photo[];
	albumName?: string;
	albumId?: string | string[] | undefined;
}

interface DownloadAlbumReturn {
	downloadAlbum: () => Promise<void>;
	isFsaSupported: boolean;
}

/**
 * Хук для скачивания изображений выбранного альбома
 * Цепочка передачи и вызова: page -> HeaderItems -> DownloadAlbumModal
 * Выходной файл будет иметь формат ${index + 1}_${albumName}_${randomSuffix}.${extension}
 *
 * @param params
 * @returns { downloadAlbum: () => void, isFsaSupported: boolean }
 */

export const useDownloadAlbum = ({
	photos,
	albumName,
	albumId,
}: DownloadAlbumParams): DownloadAlbumReturn => {
	const isFsaSupported = "showDirectoryPicker" in window;

	const downloadAlbum = useCallback(async () => {
		console.log("Скачивание альбома, начало загрузки", {
			photos,
			albumName,
			albumId,
		});
		if (!photos || photos.length === 0) {
			alert("Альбом пуст или фотографии не загружены");
			return;
		}

		// Функция для запасной логики без FSA API
		const fallbackDownload = async () => {
			let successCount = 0;
			const errors: number[] = [];
			const delay = (ms: number) =>
				new Promise<void>((resolve) => setTimeout(resolve, ms));

			for (const [index, photo] of photos.entries()) {
				try {
					const link = document.createElement("a");
					const fullPath = `${window.location.origin}${photo.path}`;
					link.href = fullPath;

					const extension = photo.path.split(".").pop()?.toLowerCase() || "jpg";
					const suffix = crypto.randomUUID().slice(0, 6);

					const fileName = `${index + 1}_${
						albumName || `album_${albumId}`
					}_${suffix}.${extension}`;
					link.download = fileName;

					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					successCount++;

					console.log(
						`Запущено скачивание ${index + 1}/${photos.length}: ${fileName}`,
					);
				} catch (error) {
					console.error(`Ошибка загрузки фото ${index + 1}:`, error);
					errors.push(index + 1);
				}

				// Делаем паузу между скачиваниями, чтобы браузер успевал их обработать
				if (index < photos.length - 1) {
					await delay(100);
				}
			}

			console.log("Скачивание альбома завершено", {
				total: photos.length,
				started: successCount,
				errors,
			});

			alert(
				`Обработка завершена.\n` +
					`Запущено скачиваний: ${successCount} из ${photos.length}.\n` +
					`Ошибок запуска: ${errors.length}` +
					(errors.length ? `\nНомера фотографий: ${errors.join(", ")}` : ""),
			);
		};

		// Проверка поддержки API
		if (!isFsaSupported) {
			console.log(
				"File System Access API не поддерживается, переключение на запасную логику",
			);
			await fallbackDownload();
			return;
		}

		try {
			// Попытка с File System Access API
			const dirHandle = await window.showDirectoryPicker();
			const albumFolderHandle = await dirHandle.getDirectoryHandle(
				albumName || `album_${albumId}`,
				{ create: true },
			);

			// Сохранение каждого фото
			for (const [index, photo] of photos.entries()) {
				const response = await fetch(`${window.location.origin}${photo.path}`);
				if (!response.ok) throw new Error(`Ошибка загрузки фото ${photo.path}`);
				const blob = await response.blob();

				const extension = photo.path.split(".").pop()?.toLowerCase() || "jpg";
				const suffix = crypto.randomUUID().slice(0, 6);

				const fileName = `${index + 1}_${
					albumName || `album_${albumId}`
				}_${suffix}.${extension}`;
				const fileHandle = await albumFolderHandle.getFileHandle(fileName, {
					create: true,
				});
				const writable = await fileHandle.createWritable();
				await writable.write(blob);
				await writable.close();
			}
		} catch (error) {
			console.error("Ошибка скачивания:", error);
		}
	}, [photos, albumName, albumId, isFsaSupported]);

	return { downloadAlbum, isFsaSupported };
};
