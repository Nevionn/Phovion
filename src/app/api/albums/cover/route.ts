import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  const { photoId, albumId } = await request.json();

  if (!photoId || isNaN(Number(photoId))) {
    return NextResponse.json(
      { error: "Photo ID обязателен и должен быть числом" },
      { status: 400 }
    );
  }

  if (!albumId || isNaN(Number(albumId))) {
    return NextResponse.json(
      { error: "Album ID обязателен и должен быть числом" },
      { status: 400 }
    );
  }

  try {
    const updatedAlbum = await prisma.album.update({
      where: { id: Number(albumId) },
      data: { coverPhotoId: Number(photoId) },
      select: { id: true, name: true, coverPhotoId: true },
    });

    return NextResponse.json(updatedAlbum, { status: 200 });
  } catch (error) {
    console.error("Ошибка обновления обложки альбома:", error);
    return NextResponse.json(
      { error: "Не удалось обновить обложку альбома" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
