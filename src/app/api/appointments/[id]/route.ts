import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../prisma/prisma-client";

const JWT_SECRET = "your_secret_key"; // ❗ Замени на свой ключ

export async function GET(request: NextRequest) {
  try {
    // ✅ Проверяем токен авторизации
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

    // ✅ Получаем все записи пользователя
    const appointments = await prisma.appointment.findMany({
      where: { userId: userId }, // Фильтруем только по userId
      select: {
        id: true,
        date: true,
        time: true,
        notes: true,
      },
    });

    if (!appointments.length) {
      return NextResponse.json({ error: "Записей не найдено" }, { status: 404 });
    }

    console.log("📌 Найденные записи пользователя:", appointments);
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("❌ Ошибка сервера:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // ✅ Check Authorization
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

    // ✅ Parse appointment ID
    const appointmentId = parseInt(params.id, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ error: "Некорректный ID записи" }, { status: 400 });
    }

    // ✅ Fetch the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        userId: true,
        availabilityId: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
    }

    // ✅ Check if user has permission to delete
    const isAdmin = userId === 1; // Assuming admin has ID `1`
    if (!isAdmin && appointment.userId !== userId) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    // ✅ Delete the appointment inside a transaction
    await prisma.$transaction([
      prisma.appointment.delete({
        where: { id: appointment.id },
      }),
      prisma.availability.update({
        where: { id: appointment.availabilityId },
        data: { isAvailable: true },
      }),
    ]);

    console.log("✅ Запись удалена:", appointment.id);
    return NextResponse.json({ success: true, message: "Запись успешно удалена" });
  } catch (error) {
    console.error("❌ Ошибка удаления записи:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}