"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, Alert, Box, Button } from "@mui/material";
import {jwtDecode} from "jwt-decode";

export default function BlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the post");
        }
        const data = await response.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdmin = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded: { id: number } = jwtDecode(token);
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
    } catch (err: any) {
      console.error("Error deleting post:", err.message);
      setError(err.message || "An unexpected error occurred");
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
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box>
          {post.imageUrl && (
            <Box sx={{ mt: 4 }}>
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          )}
          <Typography variant="h3" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-line" }}>
            {post.content}
          </Typography>
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
