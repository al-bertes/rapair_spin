"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { Login, PersonAdd } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { jwtDecode } from "jwt-decode"; // ✅ Декодируем токен

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null); // ✅ Храним ID пользователя

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUserId(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: { id: number } = jwtDecode(token); // ✅ Декодируем токен
        setIsAuthenticated(true);
        setUserId(decoded.id); // ✅ Сохраняем userId
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    }
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ffffff", boxShadow: "none", borderBottom: "1px solid #ddd" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Логотип */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link href="/" passHref>
            <Box>
              <Image src="/img/logo.svg" alt="logo" width={210} height={50} />
            </Box>
          </Link>
        </Box>

        {/* Кнопка меню для мобильных */}
        <IconButton
          edge="end"
          sx={{ display: { xs: "block", md: "none" }, color: "black" }}
          aria-label="menu"
          onClick={toggleMenu}
        >
          <MenuIcon />
        </IconButton>

        {/* Навигация для больших экранов */}
        <Box component="nav" sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Link href="/#services" passHref>
            <Typography variant="body1" sx={{ textDecoration: "none", color: "#333" }}>
              Services
            </Typography>
          </Link>
          <Link href="/testimonials" passHref>
            <Typography variant="body1" sx={{ textDecoration: "none", color: "#333" }}>
              Testimonials
            </Typography>
          </Link>
          <Link href={isAuthenticated ? `/users/${userId}` : "/login"} passHref> {/* ✅ Проверка аутентификации */}
            <Typography variant="body1" sx={{ textDecoration: "none", color: "#333" }}>
              Schedule Repair
            </Typography>
          </Link>
          <Link href="/blog" passHref>
            <Typography variant="body1" sx={{ textDecoration: "none", color: "#333" }}>
              Blog
            </Typography>
          </Link>
        </Box>

        {/* Ссылки на вход, регистрацию, профиль и выход */}
        <Box component="nav" sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {!isAuthenticated ? (
            <>
              <Link href="/login" passHref>
                <IconButton color="primary" aria-label="login">
                  <Typography variant="caption">Sign In</Typography>
                  <Login />
                </IconButton>
              </Link>
              <Link href="/register" passHref>
                <IconButton color="secondary" aria-label="sign up">
                  <Typography variant="caption">Sign Up</Typography>
                  <PersonAdd />
                </IconButton>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/users/${userId}`} passHref> {/* ✅ Динамический профиль */}
                <Button color="primary" variant="outlined">
                  Profile
                </Button>
              </Link>
              <Button color="secondary" variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>

        {/* Выдвижное меню для мобильных */}
        <Drawer anchor="right" open={isMenuOpen} onClose={closeMenu}>
          <Box
            sx={{ width: 250, padding: 2, display: "flex", flexDirection: "column" }}
            role="presentation"
            onClick={closeMenu}
            onKeyDown={closeMenu}
          >
            <IconButton onClick={closeMenu} sx={{ alignSelf: "flex-end" }}>
              <CloseIcon />
            </IconButton>
            <List>
              <Link href="/#services" passHref>
                <ListItem component="a">
                  <ListItemText primary="Services" />
                </ListItem>
              </Link>
              <Link href="/testimonials" passHref>
                <ListItem component="a">
                  <ListItemText primary="Testimonials" />
                </ListItem>
              </Link>
              <Link href={isAuthenticated ? `/users/${userId}` : "/login"} passHref> {/* ✅ Проверка аутентификации */}
                <ListItem component="a">
                  <ListItemText primary="Schedule Repair" />
                </ListItem>
              </Link>
              <Link href="/blog" passHref>
                <ListItem component="a">
                  <ListItemText primary="Blog" />
                </ListItem>
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link href="/login" passHref>
                    <ListItem component="a">
                      <ListItemText primary="Sign In" />
                    </ListItem>
                  </Link>
                  <Link href="/register" passHref>
                    <ListItem component="a">
                      <ListItemText primary="Sign Up" />
                    </ListItem>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/users/${userId}`} passHref> {/* ✅ Динамическая ссылка */}
                    <ListItem component="a">
                      <ListItemText primary="Profile" />
                    </ListItem>
                  </Link>
                  <ListItem onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
