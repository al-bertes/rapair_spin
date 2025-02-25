// src/app/api/availability/generate/route.ts

import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Генерация доступных слотов на основе данных администратора
 */
export const POST = async (req: Request) => {
  try {
    const { startDate, endDate, startTime, endTime, intervalMinutes } = await req.json();

    if (!startDate || !endDate || !startTime || !endTime || !intervalMinutes) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const start = dayjs.utc(startDate);
    const end = dayjs.utc(endDate);

    const availabilityData = [];
    let currentDate = start;

    while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
      let currentTime = dayjs.utc(`${currentDate.format("YYYY-MM-DD")}T${startTime}:00`);
      const endOfDay = dayjs.utc(`${currentDate.format("YYYY-MM-DD")}T${endTime}:00`);

      while (currentTime.isBefore(endOfDay) || currentTime.isSame(endOfDay)) {
        availabilityData.push({ dateTime: currentTime.toDate(), isBooked: false });
        currentTime = currentTime.add(intervalMinutes, "minute");
      }

      currentDate = currentDate.add(1, "day");
    }

    console.log(`🛠️ Очищаем БД перед генерацией...`);
    await prisma.$transaction([
      prisma.appointment.deleteMany({}),
      prisma.availability.deleteMany({}),
    ]);

    console.log(`🚀 Добавляем ${availabilityData.length} слотов...`);

    const batchSize = 1000;
    for (let i = 0; i < availabilityData.length; i += batchSize) {
      await prisma.availability.createMany({
        data: availabilityData.slice(i, i + batchSize),
      });
    }

    return NextResponse.json({
      message: `Successfully generated ${availabilityData.length} availability slots!`,
    });
  } catch (error: any) {
    console.error("❌ Error generating availability:", error.message);
    return NextResponse.json(
      { error: "Failed to generate availability" },
      { status: 500 }
    );
  }
};
