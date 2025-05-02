import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { albums }: { albums: { id: number; order: number }[] } =
      await request.json();

    // Обновляем порядок альбомов в транзакции
    await prisma.$transaction(
      albums.map((album) =>
        prisma.album.update({
          where: { id: album.id },
          data: { order: album.order },
        })
      )
    );

    return NextResponse.json({ message: "Порядок альбомов обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении порядка альбомов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
