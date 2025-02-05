"use client";

import { Container, Typography, Box } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
        <Typography variant="body1">Effective Date: [Month Day, Year]</Typography>
        <Typography variant="body1">
          This Privacy Policy explains how [Your Company Name] collects, uses, and shares your information.
        </Typography>

        <Typography variant="h5" gutterBottom>1. Information We Collect</Typography>
        <Typography variant="body1">
          We collect personal information, such as your name, email, and password when you register.
        </Typography>
        <Typography variant="body1">We also collect non-personal data through cookies and analytics.</Typography>

        <Typography variant="h5" gutterBottom>2. How We Use Your Information</Typography>
        <Box component="ul">
          <li>To provide and improve our services</li>
          <li>To communicate with you</li>
          <li>To analyze site traffic</li>
          <li>To comply with legal obligations</li>
        </Box>

        <Typography variant="h5" gutterBottom>3. Your Rights</Typography>
        <Typography variant="body1">
          If you are a resident of California (CCPA) or the EU (GDPR), you can request access or deletion of your data.
        </Typography>

        <Typography variant="h5" gutterBottom>4. Contact Us</Typography>
        <Typography variant="body1">For any questions, contact us at support@[yourdomain].com.</Typography>
      </Box>
    </Container>
  );
}
