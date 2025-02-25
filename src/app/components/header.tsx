"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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
  Container,
  Stack,
} from "@mui/material";
import { Login, PersonAdd, Menu, Close } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MenuItemLink from "@/app/components/MenuItemLink";
import { motion } from "framer-motion";

const menuItems = [
  { href: "/#services", text: "Services" },
  { href: "/testimonials", text: "Testimonials" },
  { href: "/blog", text: "Blog" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    signOut();
    closeMenu();
    router.push("/");
  };

  useEffect(() => {
    closeMenu();
  }, [session]);

  const isAuthenticated = !!session;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid #ddd",
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            paddingY: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/" passHref>
              <Box>
                <Image src="/img/logo.svg" alt="logo" width={210} height={50} />
              </Box>
            </Link>
          </Box>

          <IconButton
            edge="end"
            sx={{ display: { xs: "block", md: "none" }, color: "black" }}
            aria-label="menu"
            onClick={toggleMenu}
          >
            <Menu />
          </IconButton>

          <Stack
            direction="row"
            spacing={4}
            component="nav"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {menuItems.map((item) => (
              <Link href={item.href} passHref key={item.text}>
                <Typography
                  variant="body1"
                  component={motion.div}
                  whileHover={{ scale: 1.1, color: "#1976d2" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "500",
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "#333",
                  }}
                >
                  {item.text}
                </Typography>
              </Link>
            ))}

            <Link href={isAuthenticated ? "/profile" : "/login"} passHref>
              <Typography
                variant="body1"
                component={motion.div}
                whileHover={{ scale: 1.1, color: "#1976d2" }}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "500",
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "#333",
                }}
              >
                Schedule Repair
              </Typography>
            </Link>
          </Stack>

          <Box
            component="nav"
            sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}
          >
            {status === "loading" ? (
              <Typography variant="body1">Loading...</Typography>
            ) : !isAuthenticated ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Login />}
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PersonAdd />}
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                  onClick={() => router.push("/register")}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ fontFamily: "'Poppins', sans-serif" }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>

          <Drawer anchor="right" open={isMenuOpen} onClose={closeMenu}>
            <Box
              sx={{
                width: 250,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "#f9f9f9",
              }}
            >
              <IconButton onClick={closeMenu} sx={{ alignSelf: "flex-end" }}>
                <Close />
              </IconButton>
              <List>
                {menuItems.map((item) => (
                  <MenuItemLink
                    key={item.text}
                    href={item.href}
                    text={item.text}
                    closeMenu={closeMenu}
                  />
                ))}
                <MenuItemLink
                  href={isAuthenticated ? "/profile" : "/login"}
                  text="Schedule Repair"
                  closeMenu={closeMenu}
                />
                {isAuthenticated && (
                  <ListItem  onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
