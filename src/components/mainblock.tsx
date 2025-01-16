import React from "react";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import Image from "next/image";

export default function HeroSection({ setIsPopupOpen }: { setIsPopupOpen: (open: boolean) => void }) {
  return (
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
                onClick={() => setIsPopupOpen(true)}
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
  );
}
