"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Rating,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

const TestimonialForm = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [existingTestimonial, setExistingTestimonial] = useState<{ id: number; message: string; rating: number } | null>(null);

  // 📌 1. Загружаем текущий отзыв пользователя
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch("/api/testimonials/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Проверяем, есть ли тело у ответа
        const contentLength = response.headers.get("Content-Length");
        if (response.status === 204 || contentLength === "0") {
          setExistingTestimonial(null);
          return;
        }

        // ✅ Проверяем, что ответ - JSON
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Некорректный формат ответа от сервера.");
        }

        const data = await response.json();
        if (response.ok && data) {
          setExistingTestimonial(data);
        }
      } catch (error) {
        console.error("❌ Ошибка загрузки отзыва:", error);
      }
    };

    fetchTestimonial();
  }, []);

  // 📌 2. Добавление отзыва
  const handleSubmit = async () => {
    if (!message.trim() || !rating) {
      setFeedback("Заполните все поля.");
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setFeedback("Вы не авторизованы.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, rating }),
      });

      // ✅ Проверяем JSON перед `await response.json()`
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Некорректный формат ответа сервера.");
      }

      const data = await response.json();
      if (response.ok) {
        setExistingTestimonial(data);
        setMessage("");
        setRating(null);
        setFeedback("Отзыв успешно добавлен!");
      } else {
        setFeedback(data.error || "Ошибка при добавлении отзыва.");
      }
    } catch (error) {
      console.error("❌ Ошибка добавления отзыва:", error);
      setFeedback("Ошибка сервера.");
    }

    setLoading(false);
  };

  // 📌 3. Удаление отзыва
  const handleDelete = async () => {
    if (!existingTestimonial) return;

    setLoading(true);
    setFeedback(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setFeedback("Вы не авторизованы.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/testimonials/${existingTestimonial.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setExistingTestimonial(null);
        setFeedback("Отзыв удален.");
      } else {
        setFeedback("Ошибка удаления отзыва.");
      }
    } catch (error) {
      console.error("❌ Ошибка удаления отзыва:", error);
      setFeedback("Ошибка сервера.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h5">Ваш отзыв</Typography>

      {/* ✅ Если отзыв уже есть → Показываем его */}
      {existingTestimonial ? (
        <Card sx={{ width: "100%", textAlign: "center" }}>
          <CardContent>
            <Rating value={existingTestimonial.rating} readOnly sx={{ fontSize: "2rem" }} />
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {existingTestimonial.message}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Удалить отзыв"}
            </Button>
          </CardActions>
        </Card>
      ) : (
        <>
          {/* ✅ Если отзыва нет → Форма добавления */}
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            precision={1}
            sx={{ fontSize: "2rem" }}
          />
          <TextField
            label="Ваш отзыв"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {feedback && (
            <Typography color={feedback.includes("успешно") ? "green" : "red"}>{feedback}</Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Оставить отзыв"}
          </Button>
        </>
      )}
    </Box>
  );
};

export default TestimonialForm;
