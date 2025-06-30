import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Theme } from "@/app/shared/theme/themePalette";

const prisma = new PrismaClient();

export async function GET() {
  const appTheme = await prisma.appTheme.findFirst();
  const theme: Theme = (appTheme?.theme as Theme) || "SpaceBlue"; // Значение по умолчанию
  return NextResponse.json({ theme });
}

export async function POST(request: Request) {
  const { theme } = (await request.json()) as { theme: Theme };
  if (!theme) {
    return NextResponse.json({ error: "Theme is required" }, { status: 400 });
  }

  // Сохраняем или обновляем тему
  await prisma.appTheme.upsert({
    where: { id: 1 },
    update: { theme },
    create: { theme },
  });

  console.log("Saving theme:", theme);
  return NextResponse.json({ message: "Theme saved", theme });
}
