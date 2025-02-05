"use client";
import { useState } from "react";
import React from "react";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";
import ContactForm from "./form";

export default function HeroSection() {
  const [isPopupOpen, setIsPoupOpen] = useState(false);


  const closePopup = () => {
    setIsPoupOpen(false);
  };
  return (
    <>
        <OutsideClickHandler onOutsideClick={closePopup}>
        <AnimatePresence>
          {isPopupOpen && (
            <motion.div
              className={`popup ${isPopupOpen ? 'popup--open' : ''}`}
              id="popup"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Останавливаем всплытие событий
            >
              <div className="popup-content">
                <button className="menu__close-popup" onClick={closePopup}>
                  <Image src="../img/close.svg" alt="menu-close" width={24} height={24} />
                </button>
                <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Have questions or need urgent assistance? Contact our team today! <br />
          We&apos;re here to help you with all your washing machine repair needs.
        </Typography>
                <ContactForm closePopup={closePopup} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </OutsideClickHandler>

      {/* Overlay */}
      <div className={`overlay-popup${isPopupOpen ? ' active' : ''}`}></div>
    <Box
      component="section"
      sx={{
        background: "linear-gradient(to top right, rgba(227, 242, 253, 1), rgba(255, 255, 255, 1))",
        py: 6,
      }}
      >
      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Текстовая информация */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                We Bring Your Appliances Back to Life
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              Pavel&apos;s Appliance Repair offers fast, reliable, and affordable solutions for household appliances. We specialize in repairing washers and dryers (drums, motors, heating), refrigerators (cooling and seals), dishwashers (drainage and electrical), and ovens or stoves (burners and controls). Trust us to get your appliances running like new!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setIsPoupOpen(true)}
                >
                REQUEST SERVICE
              </Button>
            </Box>
          </Grid>

          {/* Изображение */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "center" }}>
              <Image
                src="/img/hero.webp"
                alt="Illustration of washing machine repair process"
                width={500}
                height={300}
                style={{ borderRadius: "8px", maxWidth: "100%",
                  height: "auto",}}
                  />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
   </>
  );
}
