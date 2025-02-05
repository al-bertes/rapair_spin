import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma-client";

const JWT_SECRET = "your_secret_key"; // ❗ Замени на свой ключ
// 📌 Получение списка отзывов (GET /api/testimonials)
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: true, // Подгружаем данные пользователя
      },
    });

    return NextResponse.json(
      testimonials.map((t) => ({
        id: t.id,
        user: t.user ? t.user.name : t.userName || "Аноним", // Если есть user, берем его имя, иначе userName
        message: t.message,
        rating: t.rating,
        createdAt: t.createdAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Ошибка получения отзывов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// 📌 Создание отзыва (POST /api/testimonials)
export async function POST(request: NextRequest) {
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
    let { userName, message, rating } = await request.json();

    if (!message.trim() || !rating) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        userId: userId !== 1 ? userId : null,
        userName: userId === 1 ? userName : null,
        message,
        rating,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
