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
    <Box sx={{ maxWidth: 800,
      margin: "auto",
      textAlign: "center",
      padding: 4,
      paddingTop: '0',
      marginTop: {
        xs: 2,
        sm: 4, 
        md: 6,   
        lg: 8,   
        xl: 10  
      }
      }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: '24px' }}>Our blog</Typography>

      {loading ? (
        <CircularProgress />
      ) : latestBlog ? (
        <Card sx={{ 
          maxWidth: '400px',
          margin: '0 auto',
          marginBottom: 3, 
          boxShadow: 5, 
          borderRadius: 3, 
          transition: "0.3s", 
          "&:hover": { transform: "scale(1.02)", boxShadow: 8 , cursor: 'pointer'} 
        }}>
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
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>{latestBlog.title}</Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
            📅 {dayjs(latestBlog.createdAt).format("DD/MM/YYYY")} <br/> ✍️ {latestBlog.author?.name || "Pavel Pavluchenko"}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {latestBlog.content ? `${latestBlog.content.substring(0, 100)}...` : "Нет описания"}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ marginTop: 2, borderRadius: 50, textTransform: "none", fontWeight: "bold" }}
              onClick={() => router.push(`/blog/${latestBlog.id}`)}
            >
              Read more →
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" sx={{ color: "gray" }}>Нет доступных статей.</Typography>
      )}

      <Button
        variant="text"
        color="primary"
        sx={{ textTransform: "none", textDecoration: "underline", marginTop: 2 }}
        onClick={() => router.push("/blog")}>
      View all articles
      </Button>
    </Box>
  );
};

export default Blog;
