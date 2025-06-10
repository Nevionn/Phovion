import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const { photoId, targetAlbumId } = await request.json();

    // Валидация входных данных
    if (!photoId || !targetAlbumId) {
      return NextResponse.json(
        { error: "photoId и targetAlbumId обязательны" },
        { status: 400 }
      );
    }

    // Проверяем существование фото
    const photo = await prisma.photo.findUnique({
      where: { id: Number(photoId) },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Фотография не найдена" },
        { status: 404 }
      );
    }

    // Проверяем существование целевого альбома
    const targetAlbum = await prisma.album.findUnique({
      where: { id: Number(targetAlbumId) },
    });

    if (!targetAlbum) {
      return NextResponse.json(
        { error: "Целевой альбом не найден" },
        { status: 404 }
      );
    }

    // Обновляем альбом для фотографии
    const updatedPhoto = await prisma.photo.update({
      where: { id: Number(photoId) },
      data: { albumId: Number(targetAlbumId) },
    });

    return NextResponse.json({
      message: "Фотография успешно перемещена",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Ошибка при перемещении фотографии:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при перемещении фотографии" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
