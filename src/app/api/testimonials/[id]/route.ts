import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../prisma/prisma-client";

const JWT_SECRET = "your_secret_key"; // ❗ Замени на свой ключ

// 📌 Удаление отзыва (DELETE /api/testimonials/[id])
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Нет токена авторизации" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Неверный или устаревший токен" }, { status: 401 });
    }

    const userId = (decoded as any).id;
    const testimonialId = parseInt(params.id, 10);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: "Некорректный ID отзыва" }, { status: 400 });
    }

    // 🔹 Проверяем, существует ли отзыв
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
    }

    // 🔹 Проверяем права на удаление (только владелец или админ)
    if (testimonial.userId !== userId && userId !== 1) {
      return NextResponse.json({ error: "У вас нет прав на удаление этого отзыва" }, { status: 403 });
    }

    // 🔹 Удаляем отзыв
    await prisma.testimonial.delete({
      where: { id: testimonialId },
    });

    console.log(`✅ Отзыв ${testimonialId} удален пользователем ${userId}`);

    return NextResponse.json({ message: "Отзыв успешно удален" });
  } catch (error) {
    console.error("❌ Ошибка удаления отзыва:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
