import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    console.log("📡 Получаем апоинт пользователя...");

    // ✅ Получаем сессию
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Находим пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        appointment: {
          include: {
            availability: true, // 🔹 Загружаем дату и время из `Availability`
          },
        },
      },
    });

    if (!user || !user.appointment || !user.appointment.availability) {
      return NextResponse.json(null, { status: 200 });
    }

    // ✅ Возвращаем полные данные с `dateTime`
    return NextResponse.json({
      id: user.appointment.id,
      date: user.appointment.availability.dateTime.toISOString().split("T")[0], // 📅 Форматируем дату (YYYY-MM-DD)
      time: user.appointment.availability.dateTime.toISOString().split("T")[1].slice(0, 5), // ⏰ Форматируем время (HH:mm)
      notes: user.appointment.notes || "",
    });
  } catch (error: any) {
    console.error("❌ Ошибка получения апоинта:", error);
    return NextResponse.json(
      { error: "Ошибка сервера", details: error.message },
      { status: 500 }
    );
  }
}
