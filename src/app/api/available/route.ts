import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function GET() {
  try {
    const data = await prisma.availability.findMany({
      where: { isAvailable: true },
      select: { id: true, date: true },
      orderBy: { date: "asc" },
    });

    const availabilityMap: Record<string, { id: number; time: string }[]> = {};

    data.forEach(({ id, date }) => {
      const dateStr = date.toISOString().split("T")[0]; 
      const timeStr = date.toISOString().split("T")[1].slice(0, 5); 

      if (!availabilityMap[dateStr]) {
        availabilityMap[dateStr] = [];
      }

      availabilityMap[dateStr].push({ id, time: timeStr });
    });

    console.log("✅ API вернул даты:", availabilityMap);

    return NextResponse.json({ availability: availabilityMap });
  } catch (error) {
    console.error("❌ Error get dates:", error);
    return NextResponse.json({ error: "Error in server" }, { status: 500 });
  }
}
