import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { photos } = await request.json();

    if (
      !Array.isArray(photos) ||
      photos.some((p: any) => !p.id || typeof p.order !== "number")
    ) {
      return NextResponse.json(
        { error: "Неверный формат данных" },
        { status: 400 }
      );
    }

    // Обновляем порядок фотографий
    await prisma.$transaction(
      photos.map((photo: { id: number; order: number }) =>
        prisma.photo.update({
          where: { id: photo.id },
          data: { order: photo.order },
        })
      )
    );

    return NextResponse.json({ message: "Порядок фотографий обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении порядка фотографий:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
