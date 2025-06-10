import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const { photoId } = await req.json();

  if (!photoId || typeof photoId !== "number") {
    return NextResponse.json(
      { message: "photoId должен быть числом и обязателен" },
      { status: 400 }
    );
  }

  try {
    const deletedPhoto = await prisma.photo.delete({
      where: { id: photoId },
    });

    console.log(
      `Фотография с id ${photoId} успешно удалена из базы данных:`,
      deletedPhoto
    );

    return NextResponse.json(
      { message: "Фотография успешно удалена", photoId },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Ошибка при удалении фотографии:", errorMessage);
    return NextResponse.json(
      {
        message: "Ошибка сервера при удалении фотографии",
        error: errorMessage,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
