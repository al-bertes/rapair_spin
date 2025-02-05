import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

export async function DELETE(request: NextRequest) {
      // Проверяем заголовок Authorization
      const authHeader = request.headers.get("Authorization");
  
      if (!authHeader) {
        return NextResponse.json(
          { error: "Authorization header is missing" },
          { status: 401 }
        );
      }
  
      // Извлекаем токен из заголовка
      const token = authHeader.replace("Bearer ", "").trim();
  
      // Декодируем токен
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
  
      // Проверяем, что пользователь имеет id = 1
      if (decoded.id !== 1) {
        return NextResponse.json(
          { error: "Access denied. Only the admin can create blog posts." },
          { status: 403 }
        );
      }
    try {
      const body = await request.json();
      const { id } = body;
  
      if (!id) {
        throw new Error("Missing required field: id");
      }
  
      await prisma.blogPost.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        } else {
          console.error("Unknown error:", error);
          return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 }
          );
        }
    }
  }