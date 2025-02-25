import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log("📡 Запрос на бронирование получен...");

    // ✅ Парсим JSON-запрос
    const { date, time, notes, address } = await req.json();
    console.log(`📅 Дата: ${date} ⏰ Время: ${time} 📝 Notes: ${notes}`);

    // ✅ Получаем сессию
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Находим пользователя по email
    let user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user) {
      console.log("🆕 Создаём нового пользователя...");
      user = await prisma.user.create({
        data: {
          name: session.user.name || "New User",
          email: session.user.email,
          password: "",
        },
      });
    }

    // ✅ Проверяем, есть ли уже запись у пользователя
    const existingAppointment = await prisma.appointment.findUnique({
      where: { userId: user.id },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "У вас уже есть активный апоинтмент." },
        { status: 400 }
      );
    }

    // ✅ Преобразуем дату в точный формат UTC
    const selectedDateTime = dayjs.utc(`${date}T${time}`).toISOString();
    console.log("🔍 Ищем свободный слот на:", selectedDateTime);

    // ✅ Проверяем все доступные слоты в базе для отладки
    const allSlots = await prisma.availability.findMany({
      where: { isBooked: false },
      select: { id: true, dateTime: true, isBooked: true },
    });

    console.log("📜 Все доступные слоты в базе:", allSlots);

    // ✅ Исправленный поиск доступности
    const availability = await prisma.availability.findFirst({
      where: {
        dateTime: selectedDateTime,
        isBooked: false,
      },
    });

    console.log("🧐 Найдено:", availability);

    if (!availability) {
      return NextResponse.json(
        { error: "Выбранное время уже забронировано или не найдено." },
        { status: 400 }
      );
    }

    // ✅ Создаём запись в Appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        availabilityId: availability.id,
        notes,
        address
      },
    });

    // ✅ Обновляем статус Availability
    await prisma.availability.update({
      where: { id: availability.id },
      data: { isBooked: true },
    });

    console.log("✅ Запись успешно создана!");
    return NextResponse.json({ message: "Запись успешно создана!", appointment });
  } catch (error: any) {
    console.error("❌ Ошибка бронирования:", error);
    return NextResponse.json({ error: "Ошибка сервера", details: error.message }, { status: 500 });
  }
}
