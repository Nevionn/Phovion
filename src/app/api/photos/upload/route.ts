import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Photo } from "@/app/album/[id]/types/photoTypes";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const albumId = formData.get("albumId") as string;
    const files = formData.getAll("photos") as File[];

    if (!albumId) {
      return NextResponse.json(
        { error: "albumId обязателен" },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "Файлы не выбраны" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const createdPhotos: Photo[] = [];

    for (const file of files) {
      const fileExtension = path.extname(file.name);
      const fileName = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);
      const fileUrl = `/uploads/${fileName}`;

      // Сохраняем файл
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      // Получаем текущий максимальный order для альбома
      const maxOrder = await prisma.photo.findFirst({
        where: { albumId: Number(albumId) },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const photo = await prisma.photo.create({
        data: {
          path: fileUrl,
          albumId: Number(albumId),
          order: (maxOrder?.order ?? -1) + 1, // Увеличиваем order
        },
      });

      createdPhotos.push({
        id: photo.id,
        path: photo.path,
        order: photo.order,
      });
    }

    return NextResponse.json(createdPhotos);
  } catch (error) {
    console.error("Ошибка при загрузке фотографий:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
