import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Rating,
} from "@mui/material";
import { motion, useMotionValue } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { testimonials } from "@/app/constants";

export default function TestimonialsSection() {
  const x = useMotionValue(0); // Управление скроллом
  const itemWidth = 510; // Ширина элемента + отступы

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => x.set(x.get() - itemWidth), // Свайп влево
    onSwipedRight: () => x.set(x.get() + itemWidth), // Свайп вправо
  });

  return (
    <Box
      component="section"
      id="testimonials"
      sx={{
        backgroundColor: "#f5f5f5",
        py: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        What Our Customers Are Saying
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        gutterBottom
        sx={{ mb: 4 }}
      >
        We pride ourselves on delivering exceptional service. <br />
        Here&apos;s what our customers have to say about their experience.
      </Typography>
      <div
        {...swipeHandlers}
        style={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          style={{
            display: "flex",
            x,
          }}
          drag="x"
          dragConstraints={{
            left: -(testimonials.length - 1) * itemWidth,
            right: 0,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              style={{
                flexShrink: 0,
                width: "100%",
                maxWidth: "480px",
                marginRight: "30px",
              }}
            >
              <Card
                sx={{
                  mx: "auto",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      alt={testimonial.name}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Typography variant="h6" component="div">
                      {testimonial.name}
                    </Typography>
                  </Box>
                  <Rating
                    value={testimonial.rating} // Оценка из данных
                    readOnly
                    precision={0.5} // Поддержка половинных звёзд
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    &quot;{testimonial.comment}&quot;
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Box>
  );
}
