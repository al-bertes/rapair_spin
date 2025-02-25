"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // ✅ NextAuth
import { useSession } from "next-auth/react"; // ✅ Добавляем useSession
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import AuthButton from "../components/AuthButton";
import { signOut } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { update } = useSession(); // ✅ Подключаем update()

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  console.log("Login response:", res);

  if (!res || res.error) {
    setError(res?.error || "Login failed. Please try again.");
    setPassword(""); // ❌ Очищаем пароль при ошибке

    // ✅ Если пользователя нет, предлагаем регистрацию
    if (res?.error === "No user found with this email") {
      setError("No account found. Would you like to sign up?");
    }
  } else {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 🔹 Ждем перед обновлением сессии
      await update(); // ✅ Принудительное обновление сессии
      console.log("Session updated!"); // ✅ Проверяем обновилась ли сессия
      router.refresh(); // ✅ Обновляем страницу
      router.replace("/profile"); // ✅ Перенаправляем пользователя
    } catch (error) {
      console.error("Error updating session:", error);
    }
  }
};

  



  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">Login</Typography>

        {error && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Alert severity="error">{error}</Alert>

            {/* ✅ Кнопка регистрации, если пользователя нет */}
            {error === "No account found. Would you like to sign up?" && (
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => router.push("/register")}
              >
                Sign up
              </Button>
            )}
          </Box>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>

          {/* ✅ Вход через Google */}
          <AuthButton />
        </Box>
      </Box>
    </Container>
  );

}
