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
  Avatar,
} from "@mui/material";
import { useSession } from "next-auth/react"; 
import { motion } from "framer-motion";

// 🎨 Цветовая палитра для нейтральных аватарок
const avatarColors = ["#FFC107", "#03A9F4", "#8BC34A", "#FF5722", "#9C27B0", "#607D8B", "#FF9800"];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function TestimonialsPage() {
  const { data: session, status } = useSession(); 
  const [testimonials, setTestimonials] = useState<
    { id: number; userName: string | null; message: string; rating: number }[]
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
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("❌ Error loading testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (session?.user?.email === "art.bertes@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  const handleDeleteTestimonial = async (id: number) => {
    if (!isAdmin) return alert("Only the administrator can delete testimonials.");

    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        alert("Testimonial successfully deleted!");
      } else {
        alert("Error deleting testimonial.");
      }
    } catch (error) {
      console.error("❌ Error deleting testimonial:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          fontFamily: "'Poppins', sans-serif",
          color: "#1976d2",
        }}
      >
        What Our Customers Say
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {testimonials.map(({ id, userName, message, rating }) => {
            const initials = (userName || "A").slice(0, 1).toUpperCase();
            const avatarColor = avatarColors[id % avatarColors.length];

            return (
              <Grid item xs={12} sm={6} key={id}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                      transition: "all 0.3s",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", padding: 3 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          margin: "auto",
                          mb: 2,
                          backgroundColor: avatarColor,
                          color: "#fff",
                          fontSize: "2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {initials}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {userName || "Anonymous"}
                      </Typography>
                      <Rating value={rating} precision={0.5} readOnly sx={{ mb: 2 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          fontStyle: "italic",
                          lineHeight: 1.6,
                        }}
                      >
                        "{message}"
                      </Typography>

                      {isAdmin && (
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ marginTop: 2 }}
                          onClick={() => handleDeleteTestimonial(id)}
                        >
                          Delete Testimonial
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
