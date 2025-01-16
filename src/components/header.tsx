import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ffffff", boxShadow: "none", borderBottom: "1px solid #ddd" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Логотип */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <a href="#main" style={{ textDecoration: "none" }}>
            <Image src="/img/logo.svg" alt="logo" width={210} height={50} />
          </a>
        </Box>

        {/* Кнопка меню для мобильных */}
        <IconButton
          edge="end"
          sx={{
            display: { xs: "block", md: "none" },
            color: "black", // Используем sx для стилизации
          }}
          aria-label="menu"
          onClick={toggleMenu}
        >
          <MenuIcon />
        </IconButton>

        {/* Навигация для больших экранов */}
        <Box
          component="nav"
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
          }}
        >
          <Typography variant="body1">
            <a href="#services" style={{ textDecoration: "none", color: "#333" }}>
              Services
            </a>
          </Typography>
          <Typography variant="body1">
            <a href="#testimonials" style={{ textDecoration: "none", color: "#333" }}>
              Testimonials
            </a>
          </Typography>
          <Typography variant="body1">
            <a href="#contact" style={{ textDecoration: "none", color: "#333" }}>
              Contact
            </a>
          </Typography>
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
              <ListItem component="a" href="#services">
                <ListItemText primary="Services" />
              </ListItem>
              <ListItem component="a" href="#testimonials">
                <ListItemText primary="Testimonials" />
              </ListItem>
              <ListItem  component="a" href="#contact">
                <ListItemText primary="Contact" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
