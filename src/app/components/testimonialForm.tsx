"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Rating } from "@mui/material";
import { useSession } from "next-auth/react";

type Testimonial = {
  id: number;
  message: string;
  rating: number;
  userName: string;
  createdAt: string;
};

const TestimonialForm = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [loading, setLoading] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        const data = await response.json();
        setTestimonials(data);

        // Check if the current user has a testimonial
        if (session?.user?.email) {
          const userReview = data.find((t: Testimonial) => t.userName === session.user.name);
          setUserTestimonial(userReview || null);
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
      }
    };

    fetchTestimonials();
  }, [session]);

  // 🔹 Submit a testimonial
  const handleSubmit = async () => {
    if (!message.trim() || !rating) return;

    setLoading(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, rating }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Testimonial submitted!");
        setMessage("");
        setRating(5);

        setTestimonials([...testimonials, result.testimonial]);
        setUserTestimonial(result.testimonial);
      } else {
        alert("Submission error.");
      }
    } catch (error) {
      console.error("❌ Error submitting testimonial:", error);
    }
    setLoading(false);
  };

  // 🔹 Delete a testimonial
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/testimonials", { method: "DELETE" });

      if (response.ok) {
        alert("Testimonial deleted!");
        setUserTestimonial(null);
        setTestimonials(testimonials.filter((t) => t.id !== userTestimonial?.id));
      } else {
        alert("Deletion error.");
      }
    } catch (error) {
      console.error("❌ Error deleting testimonial:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <Typography variant="h5" gutterBottom>Testimonials</Typography>

      {!userTestimonial ? (
        <>
          <TextField
            label="Your testimonial"
            multiline
            rows={3}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Rating value={rating} onChange={(_, newValue) => setRating(newValue)} />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </>
      ) : (
        <Box sx={{ padding: 2, backgroundColor: "#e3f2fd", borderRadius: "8px" }}>
          <Typography variant="h6">{userTestimonial.userName}</Typography>
          <Typography>{userTestimonial.message}</Typography>
          <Rating value={userTestimonial.rating} readOnly />
          <Button
            variant="contained"
            color="error"
            sx={{ marginTop: 2 }}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete testimonial"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TestimonialForm;
