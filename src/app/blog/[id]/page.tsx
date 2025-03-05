"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, Alert, Box, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
}

interface DecodedToken {
  id: number;
}

export default function BlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the post");
        }
        const data: BlogPost = await response.json();
        setPost(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdmin = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.id === 1) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };

    fetchPost();
    checkAdmin();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`/api/blog/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: Number(id) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete the post");
      }

      router.push("/blog"); // Redirect after deletion
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error deleting post:", err.message);
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <Container maxWidth="sm" sx={{ padding: 0, mt: 4, mb: 4 }}>
        <Box>
          {post?.imageUrl && (
            <Box sx={{ mt: 4 }}>
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={800}
                height={500}
                style={{
                  maxWidth: "100%", // 🔹 Ограничиваем ширину
                  height: "auto",   // 🔹 Поддерживаем пропорции
                  borderRadius: "8px",
                }}
                priority
              />
            </Box>
          )}
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              lineHeight: { xs: '1.2', sm: '1.3', md: '1.4' }
            }}
          >
            {post?.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              whiteSpace: "pre-line",
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              lineHeight: { xs: "1.4", sm: "1.6", md: "1.8" },
            }}
          >
            {post?.content}
          </Typography>
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push("/blog")}
            >
              Read More Articles
            </Button>
          </Box>
          {isAdmin && (
            <Box sx={{ mt: 4, textAlign: "right" }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Delete Post
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Suspense>
  );
}
