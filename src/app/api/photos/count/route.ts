import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.photo.count();
    return NextResponse.json({ photos: count });
  } catch (error) {
    console.error("Ошибка при получении количества фотографий:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
