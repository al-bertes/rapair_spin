import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const services = [
    {
      title: "Washer and Dryer Repair",
      img: "/img/washer.webp",
    },
  {
    title: "Refrigerator Repair",
    img: "/img/refrigerator.webp",
  },
  {
    title: "Dishwasher Repair",
    img: "/img/dishwasher.webp",
  },
  {
    title: "Oven and Stove Repair",
    img: "/img/stove.webp",
  },
];

export default function Services() {
  return (
    <Box
      component="section"
      id="services"
      sx={{
        backgroundColor: "#f9f9f9",
        py: 6,
        px: 3,
        marginTop: {
          xs: 2,
          sm: 4, 
          md: 6,   
          lg: 8,   
          xl: 10  
        }
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Our Services
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                maxWidth: 345,
                mx: "auto",
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: "#e3f2fd"
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={service.img}
                alt={service.title}
                sx={{ objectFit: "contain", padding: 2 }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {service.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
