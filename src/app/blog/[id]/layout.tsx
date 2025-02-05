"use client";

import React from "react";
import { CssBaseline, Container } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <CssBaseline />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {children}
      </Container>
    </div>
  );
}