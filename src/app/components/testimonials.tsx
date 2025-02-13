"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Rating,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<
    { id: number; userName?: string; user?: string; rating: number; message: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // ✅ Загружаем отзывы
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) throw new Error("Ошибка загрузки отзывов");

        const data = await response.json();
        setTestimonials(data.slice(-2)); 
      } catch (error) {
        console.error("❌ Ошибка загрузки отзывов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <Box component="section" id="testimonials" sx={{ backgroundColor: "#f5f5f5", textAlign: "center",
      marginTop: {
      xs: 2,
      sm: 4, 
      md: 6,   
      lg: 8,   
      xl: 10  
    }}}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>Customer testimonials</Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
      Our customers trust us. Here's what they say
      </Typography>

      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : testimonials.length === 0 ? (
        <Typography color="text.secondary">Отзывов пока нет.</Typography>
      ) : (
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          {testimonials.map(({ id, userName, user, rating, message }) => {
            const name = userName ? userName : user;
            return (
            <Card key={id} sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar alt={name} sx={{ width: 56, height: 56, mr: 2 }} />
                  <Typography variant="h6">{name}</Typography>
                </Box>
                <Rating value={rating} readOnly precision={0.5} sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  "{message}"
                </Typography>
              </CardContent>
            </Card>
          )})}
        </Box>
      )}

      <Button variant="text" sx={{ mt: 3, textDecoration: "underline", textTransform: "none" }} onClick={() => router.push("/testimonials")}>
        View all testimonials
      </Button>
    </Box>
  );
}
