import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get("albumId");

    if (!albumId) {
      return NextResponse.json({ error: "albumId обязателен" }, { status: 400 });
    }

    const parsedAlbumId = Number(albumId);
    if (isNaN(parsedAlbumId)) {
      return NextResponse.json({ error: "albumId должен быть числом" }, { status: 400 });
    }

    const count = await prisma.photo.count({
      where: { albumId: parsedAlbumId },
    });

    return NextResponse.json({ photoCount: count });
  } catch (error) {
    console.error("Ошибка при получении количества фотографий:", error);
    if (error instanceof Error) {
      console.error("Стек ошибки:", error.stack);
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
