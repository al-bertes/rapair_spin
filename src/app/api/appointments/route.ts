import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../../../prisma/prisma-client";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = (decoded as any).id;
    let { date, time, notes, availabilityId } = await request.json();

    console.log("📌 Received fields before validation:", { date, time, notes, availabilityId });

    if (!date || !time || availabilityId === undefined || availabilityId === null) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const parsedAvailabilityId = Number(availabilityId);
    if (isNaN(parsedAvailabilityId)) {
      return NextResponse.json({ error: "Invalid availabilityId format" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        date: new Date(date),
        time,
        notes: notes || "",
        availabilityId: parsedAvailabilityId,
      },
    });

    // ✅ Update availability after booking
    await prisma.availability.update({
      where: { id: parsedAvailabilityId },
      data: { isAvailable: false }, // Now the time slot is booked
    });

    console.log("✅ Appointment successfully created:", appointment);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = (decoded as any).id;
    console.log("✅ User ID:", userId);

    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        date: true,
        time: true,
        notes: true,
        user: {
          select: { name: true },
        },
      },
    });

    console.log("📌 Appointments found:", appointments.length);

    return NextResponse.json(appointments.length ? appointments : []); // ✅ Always return an array
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // ✅ Cast to JwtPayload
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id as number; // ✅ Explicitly specify that id is a number
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const isAdmin = userId === 1; // ✅ Check if the user is an admin

    // ✅ Read request body
    let body;
    try {
      body = await request.json();
      console.log("📌 Request body:", body);
    } catch (error) {
      return NextResponse.json({ error: "Error reading request data" }, { status: 400 });
    }

    const { appointmentId } = body;
    if (!appointmentId || isNaN(Number(appointmentId))) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
    }

    // ✅ Check if the appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(appointmentId) },
      select: { id: true, userId: true, availabilityId: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // ✅ Check if the user has permission to delete the appointment
    if (!isAdmin && appointment.userId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ✅ Delete the appointment
    await prisma.appointment.delete({
      where: { id: appointment.id },
    });

    // ✅ Free up the availability slot
    await prisma.availability.update({
      where: { id: appointment.availabilityId },
      data: { isAvailable: true },
    });

    console.log("✅ Appointment deleted:", appointment.id);
    return NextResponse.json({ success: true, message: "Appointment canceled" });
  } catch (error) {
    console.error("❌ Error deleting appointment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
