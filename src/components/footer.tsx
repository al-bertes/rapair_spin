import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f9f9f9",
        py: 4,
        borderTop: "1px solid #ddd",
      }}
    >
      <Container>
        <Box component="address" sx={{ fontStyle: "normal", textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Call Us:{" "}
            <Link href="tel:+17634853734" underline="none" color="primary">
              +1 763-485-3734
            </Link>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Email:{" "}
            <Link href="mailto:PavelsApplianceRepair@gmail.com" underline="none" color="primary">
              PavelsApplianceRepair@gmail.com
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Business Hours: Monday–Friday: 8:00 AM – 8:00 PM, Saturday: 9:00 AM – 6:00 PM
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
