import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface Context {
  params: { id: string };
}

export async function GET(request: Request, { params }: Context) {
  try {
    const album = await prisma.album.findUnique({
      where: { id: Number(params.id) },
      include: {
        photos: {
          select: { id: true, path: true, order: true },
          orderBy: { order: "asc" }, // Сортируем фотографии по полю order
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error("Ошибка при получении альбома:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Неверный ID" }, { status: 400 });
  }

  try {
    const album = await prisma.album.findUnique({ where: { id } });
    if (!album) {
      return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
    }

    const photos = await prisma.photo.findMany({ where: { albumId: id } });

    // Удаляем файлы фотографий из public/uploads
    for (const photo of photos) {
      const filePath = path.join(process.cwd(), "public", photo.path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Ошибка удаления файла ${filePath}:`, err);
      }
    }

    await prisma.photo.deleteMany({ where: { albumId: id } });
    await prisma.album.delete({ where: { id } });

    return NextResponse.json({ message: "Альбом и связанные файлы удалены" });
  } catch (error) {
    console.error("Ошибка при удалении альбома:", error);
    return NextResponse.json(
      { error: "Ошибка удаления альбома" },
      { status: 500 }
    );
  }
}
