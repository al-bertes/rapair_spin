import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "../../../../../prisma/prisma-client";
import fs from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    if (session.user.email !== process.env.NEXT_PUBLIC_ADMIN) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ✅ Ensure upload dir exists
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let imageUrl = "";
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: process.env.NEXT_PUBLIC_ADMIN },
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        content,
        isPublished: false,
        authorId: adminUser.id,
        imageUrl,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating blog post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
