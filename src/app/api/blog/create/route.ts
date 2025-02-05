import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../../prisma/prisma-client";

const JWT_SECRET = "your_secret_key";

const uploadDir = path.join(process.cwd(), "public/uploads");
const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  filename: (_name, _ext, part) => {
    const timestamp = Date.now();
    return `${timestamp}-${part.originalFilename}`;
  },
});

async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

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

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is missing" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (decoded.id !== 1) {
      return NextResponse.json(
        { error: "Access denied. Only the admin can create blog posts." },
        { status: 403 }
      );
    }

    const { fields, files } = await parseForm(request);

    const { title, content } = fields;

    const imageArray = files.image as File[] | undefined; // `image` теперь массив
    const image = Array.isArray(imageArray) ? imageArray[0] : undefined; // Берём первый файл

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title or content" },
        { status: 400 }
      );
    }

    if (!image || !image.filepath) {
      console.error("Image file or filepath is missing:", image); // Логируем проблему
      return NextResponse.json(
        { error: "Image file is required and must have a valid path" },
        { status: 400 }
      );
    }

    const imagePath = `/uploads/${path.basename(image.filepath)}`;

    const newPost = await prisma.blogPost.create({
      data: {
        title: String(title),
        content: String(content),
        isPublished: false,
        authorId: 1, 
        imageUrl: imagePath, 
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}


export const config = {
  api: {
    bodyParser: false, 
  },
};
