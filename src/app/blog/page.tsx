"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {jwtDecode} from "jwt-decode";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Button,
  Stack,
} from "@mui/material";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
}

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data: BlogPost[] = await response.json();
        setBlogPosts(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();

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
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  
    try {
      const response = await fetch("/api/blog/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify({ id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete the blog post");
      }
  
      // Remove the post from the UI
      setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 3 }}>
        <Typography variant="h4">Blog Section</Typography>
        {isAdmin && (
          <Link href="/createblog" passHref>
            <Button variant="contained" color="primary">
              Create Blog
            </Button>
          </Link>
        )}
      </Stack>
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <motion.div
              whileHover={{
                scale: 1.05,
                translateY: -5,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isAdmin && (
                  <motion.div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 10,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Останавливаем всплытие события, чтобы не переходить по ссылке
                        handleDelete(post.id);
                      }}
                    >
                      Delete
                    </Button>
                  </motion.div>
                )}
                <Link href={`/blog/${post.id}`} passHref>
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.imageUrl || "https://via.placeholder.com/400x200"}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.content.substring(0, 100)}...
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        By Pavel Pavluchenko
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BlogSection;
