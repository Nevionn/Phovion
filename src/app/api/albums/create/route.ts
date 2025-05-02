import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Название обязательно" },
      { status: 400 }
    );
  }

  const newAlbum = await prisma.album.create({
    data: { name },
  });

  return NextResponse.json(newAlbum);
}
