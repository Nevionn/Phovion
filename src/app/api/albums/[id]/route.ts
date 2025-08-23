import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Определяем, что params может быть промисом
interface Context {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(request: Request, context: Context) {
  // Ждём разрешения params, если это промис
  const params = await (context.params as Promise<{ id: string }>);

  if (!params || !params.id) {
    return NextResponse.json({ error: "Неверный ID" }, { status: 400 });
  }

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

    // Возвращаем альбом с полем description
    return NextResponse.json(album);
  } catch (error) {
    console.error("Ошибка при получении альбома:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  // Ждём разрешения params, если это промис
  const params = await (context.params as Promise<{ id: string }>);

  if (!params || !params.id) {
    return NextResponse.json({ error: "Неверный ID" }, { status: 400 });
  }

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

// Переименование альбома по ID и обновление описания
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await (context.params as Promise<{ id: string }>);

  if (!params || !params.id) {
    return NextResponse.json(
      { error: "ID и новое имя обязательны" },
      { status: 400 }
    );
  }

  const { id } = params;
  const { name, description } = await request.json();

  if (!id || !name) {
    return NextResponse.json(
      { error: "ID и новое имя обязательны" },
      { status: 400 }
    );
  }

  try {
    const albumId = parseInt(id, 10);
    if (isNaN(albumId)) {
      return NextResponse.json(
        { error: "Неверный ID альбома" },
        { status: 400 }
      );
    }

    const updatedAlbum = await prisma.album.update({
      where: { id: albumId },
      data: {
        name,
        description,
      },
      include: { photos: true },
    });

    return NextResponse.json(updatedAlbum, { status: 200 });
  } catch (error) {
    console.error("Ошибка переименования альбома:", error);
    if ((error as any).code === "P2025") {
      return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
