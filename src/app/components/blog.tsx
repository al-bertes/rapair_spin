"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const Blog = () => {
  const [latestBlog, setLatestBlog] = useState<{ 
    id: number; 
    title: string; 
    content?: string; // ✅ Делаем content опциональным
    imageUrl?: string; 
    createdAt: string; 
    author?: { name?: string }; // ✅ Делаем author опциональным
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLatestBlog = async () => {
      try {
        const response = await fetch("/api/blog");
        const data = await response.json();
        console.log(data)
        if (data && !data.error) {
          setLatestBlog(data[0]);
        } else {
          setLatestBlog(null);
        }
      } catch (error) {
        console.error("❌ Ошибка загрузки блога:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlog();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", textAlign: "center", padding: 4 }}>
      <Typography variant="h3" gutterBottom>Our blog</Typography>

      {loading ? (
        <CircularProgress />
      ) : latestBlog ? (
        <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
          {latestBlog.imageUrl && (
            <CardMedia
              component="img"
              height="250"
              image={latestBlog.imageUrl}
              alt={latestBlog.title}
              sx={{ objectFit: "cover" }}
            />
          )}
          <CardContent>
            <Typography variant="h5" gutterBottom>{latestBlog.title}</Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              {dayjs(latestBlog.createdAt).format("DD/MM/YYYY")} • Author: {latestBlog.author?.name || "Pavel Pavluchenko"}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {latestBlog.content ? `${latestBlog.content.substring(0, 100)}...` : "Нет описания"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" sx={{ color: "gray" }}>Нет доступных статей.</Typography>
      )}

      <Button variant="contained" color="primary" onClick={() => router.push("/blog")}>
        Все статьи
      </Button>
    </Box>
  );
};

export default Blog;
