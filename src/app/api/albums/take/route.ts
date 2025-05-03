import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      orderBy: { order: "asc" },
      include: {
        photos: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { path: true },
        },
      },
    });

    const formattedAlbums = albums.map((album) => ({
      id: album.id,
      name: album.name,
      avatar: album.photos.length > 0 ? album.photos[0].path : null,
    }));

    return NextResponse.json(formattedAlbums);
  } catch (error) {
    console.error("Ошибка при получении альбомов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
