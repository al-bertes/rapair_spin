"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Container,
  ButtonBase,
  CircularProgress,
  Button,
} from "@mui/material";
import CalendarWithBooking from "@/app/components/calendar";
import TestimonialForm from "@/app/components/testimonialForm";
import AppointmentsList from "@/app/components/appointmentsList"; // ✅ Компонент списка записей

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("Calendar");
  const [testimonial, setTestimonial] = useState<{ id: number; message: string; rating: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hydrated, setHydrated] = useState(false); // ✅ Флаг для устранения ошибки гидратации

  useEffect(() => {
    setHydrated(true); // ✅ Ожидаем монтирования перед рендером
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1])); // ✅ Декодируем JWT
          setIsAdmin(decodedToken.id === 1);
        } catch (error) {
          console.error("Ошибка проверки администратора:", error);
        }
      }
    }
  }, []);

  if (!hydrated) {
    return null; // ✅ Ожидание устранения ошибки гидратации
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        {/* Боковое меню */}
        <Box
          sx={{
            minWidth: 240,
            borderRight: "1px solid",
            borderColor: "divider",
            padding: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Profile Menu
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <List>
            {[
              "Calendar",
              "Testimonial",
              isAdmin ? "Appointments" : null, // ✅ Только админ видит "Appointments"
            ]
              .filter(Boolean) // ✅ Убираем null
              .map((text) => (
                <ListItem key={text} disablePadding>
                  <ButtonBase
                    onClick={() => setActiveSection(text!)}
                    sx={{
                      width: "100%",
                      textAlign: "left",
                      padding: 1,
                      backgroundColor: activeSection === text ? "primary.light" : "transparent",
                    }}
                  >
                    <ListItemText primary={text} />
                  </ButtonBase>
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Основной контент */}
        <Box sx={{ flex: 1, padding: 2 }}>
          <Typography variant="h4">{activeSection}</Typography>
          <Divider sx={{ marginBottom: 2 }} />

          {activeSection === "Calendar" && <CalendarWithBooking />}
          {activeSection === "Appointments" && isAdmin && <AppointmentsList />}
          {activeSection === "Testimonial" && <TestimonialForm />}
        </Box>
      </Box>
    </Container>
  );
}
