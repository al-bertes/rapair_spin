import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📌 Генерация доступных слотов...");

  // Очистка существующих данных (если нужно)
  await prisma.availability.deleteMany();

  // Задаем даты на ближайшие 7 дней
  const today = new Date();
  const availableTimes = ["09:00", "11:00", "14:00", "16:00"];

  const slots = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    for (const time of availableTimes) {
      slots.push({
        date,
        time,
        isBooked: false, // По умолчанию слот свободен
      });
    }
  }

  await prisma.availability.createMany({
    data: slots,
  });

  console.log("✅ Слоты успешно сгенерированы!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка генерации:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
