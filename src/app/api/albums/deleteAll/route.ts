import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE() {
  try {
    await prisma.album.deleteMany({});

    return NextResponse.json({ message: "Все альбомы и фотографии удалены" });
  } catch (error) {
    console.error("Ошибка при удалении альбомов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
