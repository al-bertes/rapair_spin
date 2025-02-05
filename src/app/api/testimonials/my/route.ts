import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../prisma/prisma-client";

const JWT_SECRET = "your_secret_key"; // ❗ Замени на свой секретный ключ

export async function GET(request: NextRequest) {
  try {
    // 🔹 1. Проверяем авторизацию
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
    console.log("✅ User ID:", userId);

    // 🔹 2. Ищем отзыв текущего пользователя (меняем `findUnique` на `findFirst`)
    const testimonial = await prisma.testimonial.findFirst({
      where: { userId }, // Теперь работает!
    });

    if (!testimonial) {
      return NextResponse.json(null, { status: 200 }); // ❗ Если нет отзыва, возвращаем `null`
    }

    console.log("✅ Отзыв найден:", testimonial);

    return NextResponse.json({
      id: testimonial.id,
      message: testimonial.message,
      rating: testimonial.rating,
      createdAt: testimonial.createdAt,
    });
  } catch (error) {
    console.error("❌ Ошибка загрузки отзыва:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
