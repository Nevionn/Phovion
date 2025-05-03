import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Имя альбома обязательно" },
        { status: 400 }
      );
    }

    // Создание альбома и обновление порядка в транзакции
    const album = await prisma.$transaction(async (prisma) => {
      // Увеличиваем order всех существующих альбомов на 1
      await prisma.album.updateMany({
        data: {
          order: {
            increment: 1,
          },
        },
      });

      // Создаем в начало списка новый альбом с order: 0
      return prisma.album.create({
        data: {
          name,
          order: 0,
        },
      });
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error("Ошибка при создании альбома:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
