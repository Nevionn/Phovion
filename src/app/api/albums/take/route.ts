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
        _count: { select: { photos: true } },
      },
    });

    const formattedAlbums = await Promise.all(
      albums.map(async (album) => {
        let coverPhotoPath = null;
        if (album.coverPhotoId) {
          const coverPhoto = await prisma.photo.findUnique({
            where: { id: album.coverPhotoId },
            select: { path: true },
          });
          coverPhotoPath = coverPhoto?.path || null;
        } else if (album.photos.length > 0) {
          coverPhotoPath = album.photos[0].path; // Если coverPhotoId нет, берём последнюю
        }

        return {
          id: album.id,
          name: album.name,
          description: album.description,
          photoCount: album._count.photos > 0 ? album._count.photos : null,
          coverPhotoId: album.coverPhotoId,
          coverPhotoPath,
        };
      })
    );

    return NextResponse.json(formattedAlbums);
  } catch (error) {
    console.error("Ошибка при получении альбомов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
