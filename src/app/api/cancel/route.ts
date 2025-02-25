import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    console.log("📡 Запрос на удаление апоинта...");

    // ✅ Получаем сессию пользователя
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      console.error("❌ Ошибка: пользователь не авторизован");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId } = await req.json();
    if (!appointmentId) {
      console.error("❌ Ошибка: не передан ID апоинта.");
      return NextResponse.json({ error: "Не передан ID апоинта." }, { status: 400 });
    }

    console.log("📌 Удаляем апоинт с ID:", appointmentId);

    // ✅ Получаем запись
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { availability: true }, // Получаем связанные данные
    });

    if (!appointment) {
      console.error("❌ Ошибка: апоинт не найден.");
      return NextResponse.json({ error: "Апоинт не найден." }, { status: 404 });
    }

    // ✅ Удаляем апоинт
    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    // ✅ Освобождаем слот (isBooked = false)
    if (appointment.availability) {
      await prisma.availability.update({
        where: { id: appointment.availability.id },
        data: { isBooked: false },
      });
      console.log(`✅ Слот ${appointment.availability.dateTime} снова доступен.`);
    }

    console.log("✅ Апоинт успешно удалён.");
    return NextResponse.json({ message: "Запись успешно отменена." });
  } catch (error: any) {
    console.error("❌ Ошибка удаления апоинта:", error);
    return NextResponse.json({ error: "Ошибка сервера", details: error.message }, { status: 500 });
  }
}
