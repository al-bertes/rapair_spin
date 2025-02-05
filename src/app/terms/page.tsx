"use client";

import { Container, Typography, Box } from "@mui/material";

export default function TermsOfService() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Terms of Service</Typography>
        <Typography variant="body1">Effective Date: [Month Day, Year]</Typography>
        <Typography variant="body1">
          By using our website [your-website.com], you agree to these Terms of Service.
        </Typography>

        <Typography variant="h5" gutterBottom>1. Account Registration</Typography>
        <Typography variant="body1">
          You must provide accurate information and keep your account secure.
        </Typography>

        <Typography variant="h5" gutterBottom>2. Acceptable Use</Typography>
        <Box component="ul">
          <li>You may not violate laws or regulations</li>
          <li>You may not hack, spam, or disrupt our services</li>
          <li>You may not upload offensive content</li>
        </Box>

        <Typography variant="h5" gutterBottom>3. Limitation of Liability</Typography>
        <Typography variant="body1">
          We are not responsible for any damages resulting from the use of our services.
        </Typography>

        <Typography variant="h5" gutterBottom>4. Contact Us</Typography>
        <Typography variant="body1">For any inquiries, contact us at support@[yourdomain].com.</Typography>
      </Box>
    </Container>
  );
}
