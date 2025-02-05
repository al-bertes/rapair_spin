"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Rating,
  Button,
  TextField,
} from "@mui/material";
import { jwtDecode } from "jwt-decode"; // 📌 Декодируем JWT токен

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<
    { id: number; user: string; message: string; rating: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");

        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
        }

        // ✅ Проверяем, что ответ JSON
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Некорректный формат ответа от сервера.");
        }

        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("❌ Ошибка загрузки отзывов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // ✅ Проверяем, является ли пользователь администратором
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const decoded: { id: number } = jwtDecode(token); // 📌 Расшифровка токена
        if (decoded.id === 1) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
      }
    }
  }, []);

  // ✅ Функция добавления отзыва (администратор)
  const handleAddTestimonial = async () => {
    if (!name.trim() || !message.trim() || !rating) return;

    setSubmitting(true);
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Вы не авторизованы.");
          setSubmitting(false);
          return;
        }

        const response = await fetch("/api/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userName: name, message, rating }),
        });

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Некорректный формат ответа сервера.");
        }

        const data = await response.json();
        if (response.ok) {
          setTestimonials((prev) => [...prev, data]);
          setName("");
          setMessage("");
          setRating(5);
        } else {
          alert(data.error || "Ошибка при добавлении отзыва.");
        }
      }
    } catch (error) {
      console.error("❌ Ошибка при добавлении отзыва:", error);
      alert("Ошибка при добавлении отзыва.");
    }

    setSubmitting(false);
  };

  // ✅ Функция удаления отзыва (администратор)
  const handleDeleteTestimonial = async (id: number) => {
    if (!isAdmin) return;

    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Вы не авторизованы.");
          return;
        }

        const response = await fetch(`/api/testimonials/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
        } else {
          alert("Ошибка при удалении отзыва.");
        }
      }
    } catch (error) {
      console.error("❌ Ошибка при удалении отзыва:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Отзывы клиентов
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : testimonials.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          Отзывов пока нет. Будьте первым, кто оставит отзыв!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {testimonials.map(({ id, user, message, rating }) => (
            <Grid item xs={12} sm={6} key={id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {user}
                  </Typography>
                  <Rating value={rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {message}
                  </Typography>
                  {isAdmin && (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ marginTop: 1 }}
                      onClick={() => handleDeleteTestimonial(id)}
                    >
                      Удалить
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✅ Форма добавления отзыва для администратора */}
      {isAdmin && (
        <Box
          sx={{
            marginTop: 4,
            padding: 3,
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Добавить отзыв вручную
          </Typography>
          <TextField
            label="Имя пользователя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Отзыв"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Rating value={rating} onChange={(_, newValue) => setRating(newValue)} />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleAddTestimonial}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Добавить отзыв"}
          </Button>
        </Box>
      )}
    </Container>
  );
}
