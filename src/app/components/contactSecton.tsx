"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import ContactForm from "@/app/components/form";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ContactSection() {
  return (
    <Box
      component="section"
      id="contact"
      sx={{
        backgroundColor: "#f9f9f9",
        py: 6,
        px: 3,
        textAlign: "center",
      }}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              color: "#333",
              marginBottom: 2,
            }}
          >
            Get in touch with us
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontFamily: "'Poppins', sans-serif",
              color: "#555",
            }}
          >
            Have questions or need urgent assistance? Contact our team today!
            <br />
            We&apos;re here to help you with all your washing machine repair needs.
          </Typography>
          <Box
            className="contact__container"
            sx={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              padding: 4,
              borderRadius: "16px",
            }}
          >
            <ContactForm />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
