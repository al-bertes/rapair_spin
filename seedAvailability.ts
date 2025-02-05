import dayjs from "dayjs";
import { prisma } from "./prisma/prisma-client";

async function generateAvailability(startDate: string, endDate: string, timeSlots: string[]) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  // 🔹 Генерируем даты без запросов в БД
  const dates = [];
  let currentDate = start;

  while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
    dates.push(currentDate.toISOString().split("T")[0]); // ✅ Только дата (YYYY-MM-DD)
    currentDate = currentDate.add(1, "day");
  }

  // 🔹 Очищаем БД перед вставкой
  await prisma.$transaction([
    prisma.appointment.deleteMany({}),
    prisma.availability.deleteMany({})
  ]);

  // 🔹 Генерируем массив всех доступных слотов
  const availabilityData = [];
  for (const date of dates) {
    for (const timeSlot of timeSlots) {
      availabilityData.push({
        date: new Date(`${date}T${timeSlot}:00.000Z`),
        isAvailable: true
      });
    }
  }

  // 🔹 Вставляем данные **одним** запросом
  if (availabilityData.length > 0) {
    await prisma.availability.createMany({
      data: availabilityData
    });
  }

  console.log(`✅ Успешно создано ${availabilityData.length} записей доступности.`);
}

// 🔹 Генерация доступности с 08:00 до 16:00 с указанными датами
generateAvailability(
  "2025-02-01",  // Начальная дата (YYYY-MM-DD)
  "2025-06-25",  // Конечная дата
  ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] // Интервалы времени
).catch((error) => {
  console.error("❌ Ошибка генерации доступности:", error.message);
});
