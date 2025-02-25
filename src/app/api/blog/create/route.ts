import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "../../../../../prisma/prisma-client";

const uploadDir = path.join(process.cwd(), "public/uploads");
const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024, // 5 MB limit
  filename: (_name, _ext, part) => {
    return `${Date.now()}-${part.originalFilename}`;
  },
});

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// Convert NextRequest to IncomingMessage for formidable
function convertToIncomingMessage(req: NextRequest): IncomingMessage {
  const readable = new Readable();
  readable._read = () => {};
  const reader = req.body?.getReader();

  if (reader) {
    (async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        readable.push(value);
      }
      readable.push(null);
    })();
  }

  const incomingMessage = readable as IncomingMessage;
  incomingMessage.headers = Object.fromEntries(req.headers.entries());

  return incomingMessage;
}

// Parse form data
async function parseForm(req: NextRequest): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> {
  const incomingMessage = convertToIncomingMessage(req);

  return new Promise((resolve, reject) => {
    form.parse(incomingMessage, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    // ✅ Get session from NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("❌ User not logged in.");
      return NextResponse.json({ error: "You must be logged in to create a blog post." }, { status: 401 });
    }

    // ✅ Admin check by email
    if (session.user.email !== "art.bertes@gmail.com") {
      console.error("❌ Unauthorized access attempt by:", session.user.email);
      return NextResponse.json(
        { error: "Access denied. Only the admin can create blog posts." },
        { status: 403 }
      );
    }

    // ✅ Parse form data
    const { fields, files } = await parseForm(request);
    const { title, content } = fields;

    // ✅ Validate input
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    // ✅ Handle image upload
    const imageArray = files.image as File[] | undefined;
    const image = Array.isArray(imageArray) ? imageArray[0] : undefined;
    const imagePath = image ? `/uploads/${path.basename(image.filepath)}` : "";

    // ✅ Get admin user from database
    const adminUser = await prisma.user.findUnique({
      where: { email: "art.bertes@gmail.com" },
    });

    if (!adminUser) {
      console.error("❌ Admin user not found in database.");
      return NextResponse.json({ error: "Admin user not found." }, { status: 404 });
    }

    // ✅ Create new blog post
    const newPost = await prisma.blogPost.create({
      data: {
        title: String(title),
        content: String(content),
        isPublished: false,
        authorId: adminUser.id, // Use admin's ID
        imageUrl: imagePath,
      },
    });

    console.log("✅ Blog post created:", newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating blog post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for file uploads
  },
};
