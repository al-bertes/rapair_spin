"use client";

import React, { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { jwtDecode } from "jwt-decode"; // ✅ Декодируем токен
import dayjs from "dayjs";

const convertDate = (dateString: string) => {
  return dayjs(dateString).format("MM/DD/YYYY");
};

const CalendarWithBooking = () => {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<{ id: number; time: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availabilityId, setAvailabilityId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(true);
  const [appointment, setAppointment] = useState<{ id: number; date: string; time: string; notes?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Получение текущей записи пользователя
  const fetchAppointment = async () => {
    setIsLoadingAppointment(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("⚠️ Токен отсутствует в localStorage");
        setAppointment(null);
        setIsLoadingAppointment(false);
        return;
      }
  
      const decoded: { id: number } = jwtDecode(token);
      const userId = decoded?.id;
      console.log("📌 ID пользователя из токена:", userId);
  
      if (!userId) {
        console.error("❌ Ошибка: ID пользователя отсутствует в токене.");
        setAppointment(null);
        setIsLoadingAppointment(false);
        return;
      }
  
      // ✅ Запрашиваем запись по userId в URL
      const response = await fetch(`/api/appointments/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        console.warn("⚠️ Ошибка запроса к API, статус:", response.status);
        setAppointment(null);
        setIsLoadingAppointment(false);
        return;
      }
  
      const data = await response.json();
      console.log("📌 Найденная запись пользователя:", data);
  
      // Если API возвращает `null`, значит записи нет
      setAppointment(data[0] || null);
    } catch (error) {
      console.error("❌ Ошибка загрузки записи:", error);
      setAppointment(null);
    }
    setIsLoadingAppointment(false);
  };
  
  

  useEffect(() => {
    fetchAppointment();
  }, []);

  // ✅ Получение доступных дат (если записи нет)
  const fetchAvailableDates = async () => {
    try {
      const response = await fetch("/api/available");
      const data = await response.json();
      const today = dayjs().format("YYYY-MM-DD");
      const futureDates = Object.keys(data.availability).filter((date) => date >= today);
  
      setAvailableDates(futureDates);
      if (futureDates.length > 0) {
        const firstDate = futureDates[0];
        setSelectedDate(firstDate);
        setAvailableTimes(data.availability[firstDate]);
  
        // ✅ Автоматически выбираем самое раннее доступное время
        if (data.availability[firstDate].length > 0) {
          const earliestTime = data.availability[firstDate][0]; // Берем первый слот
          setSelectedTime(earliestTime.time);
          setAvailabilityId(earliestTime.id);
        }
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки доступных дат:", error);
    }
  };
  

  useEffect(() => {
    if (!appointment) {
      fetchAvailableDates();
    }
  }, [appointment]);

  // ✅ Инициализация Flatpickr (если нет записи)
  const updateAvailableTimes = (date: string, times: { id: number; time: string }[]) => {
    setAvailableTimes(times);
    if (times.length > 0) {
      const earliestTime = times[0]; // Берем первый доступный слот
      setSelectedTime(earliestTime.time);
      setAvailabilityId(earliestTime.id);
    } else {
      setSelectedTime(null);
      setAvailabilityId(null);
    }
  };
  
  // ✅ Функция для обработки смены даты
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    fetch("/api/available")
      .then((res) => res.json())
      .then((data) => {
        updateAvailableTimes(newDate, data.availability[newDate] || []);
      });
  };
  
  // ✅ Инициализация Flatpickr (если нет записи)
  useEffect(() => {
    if (appointment || !inputRef.current || availableDates.length === 0) return;
  
    flatpickr(inputRef.current, {
      inline: true,
      enable: availableDates,
      dateFormat: "Y-m-d",
      minDate: availableDates[0],
      defaultDate: availableDates[0],
      onChange: ([selectedDate]) => {
        const dateStr = selectedDate.toISOString().split("T")[0];
        handleDateChange(dateStr); // ✅ Теперь выбирает первый доступный слот при смене даты
      },
    });
  }, [availableDates, appointment]);

  // ✅ Запрос на бронирование
  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime || !availabilityId) {
      alert("Выберите дату и время!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Вы не авторизованы. Войдите в систему.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          notes,
          availabilityId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAppointment({ id: data.id, date: selectedDate!, time: selectedTime!, notes });
        setNotes("");
      } else {
        alert(data.error || "Ошибка записи.");
      }
    } catch (error) {
      console.error("❌ Ошибка бронирования:", error);
    }
    setLoading(false);
  };

  // ✅ Отмена записи
  const cancelAppointment = async () => {
    if (!appointment) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Вы не авторизованы. Войдите в систему.");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка отмены записи.");
      }

      setAppointment(null);
      fetchAvailableDates();
    } catch (error) {
      console.error("❌ Ошибка при удалении записи:", error);
      alert(error.message || "Ошибка при удалении записи.");
    }
    setLoading(false);
  };

  if (isLoadingAppointment) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 4 }}>
      <Typography variant="h4" gutterBottom>Запись на прием</Typography>

      {appointment ? (
        <Box sx={{ backgroundColor: "#e3f2fd", padding: 2, borderRadius: "8px", textAlign: "center", marginBottom: 2 }}>
          <Typography variant="h6">Ваша запись:</Typography>
          <Typography variant="body1">📅 {convertDate(appointment.date)} ⏰ {appointment.time}</Typography>
          <Button variant="contained" color="error" sx={{ marginTop: 2 }} onClick={cancelAppointment} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Отменить запись"}
          </Button>
        </Box>
      ) : (
        <>
          <input ref={inputRef} type="text" style={{ visibility: "hidden", position: "absolute" }} readOnly />

          <Select
          title="chose time"
            fullWidth
            sx={{ marginTop: 2 }}
            value={selectedTime || ""}
            onChange={(e) => {
              const selected = availableTimes.find((time) => time.time === e.target.value);
              if (selected) {
                setSelectedTime(selected.time);
                setAvailabilityId(selected.id);
              }
            }}
          >
            {availableTimes.map(({ id, time }) => (
              <MenuItem key={id} value={time}>{time}</MenuItem>
            ))}
          </Select>

          <TextField
            label="Заметки (необязательно)"
            multiline
            rows={2}
            fullWidth
            sx={{ marginTop: 2 }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button variant="contained" color="primary" sx={{ marginTop: 3 }} onClick={bookAppointment} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Записаться"}
          </Button>
        </>
      )}
    </Box>
  );
};

export default CalendarWithBooking;
