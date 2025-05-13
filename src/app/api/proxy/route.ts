import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const urlParam = request.url.split("?url=")[1];
  if (!urlParam) {
    return NextResponse.json({ error: "URL обязателен" }, { status: 400 });
  }

  // Декодируем URL, чтобы обработать специальные символы
  const url = decodeURIComponent(urlParam);
  console.log("Получен URL для прокси:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error("Ошибка fetch:", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `Не удалось загрузить изображение: ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      console.error("Некорректный тип контента:", contentType);
      throw new Error("URL не указывает на изображение");
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log("Размер arrayBuffer:", arrayBuffer.byteLength);

    if (arrayBuffer.byteLength === 0) {
      throw new Error("Получен пустой буфер");
    }

    const filename = url.split("/").pop() || "image.jpg";
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Ошибка прокси:", error);
    return NextResponse.json(
      { error: `Не удалось обработать изображение: ` },
      { status: 500 }
    );
  }
}
