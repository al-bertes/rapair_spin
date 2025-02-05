import React from "react";
import { CssBaseline, Container, AppBar, Toolbar, Typography } from "@mui/material";
import Header from "../components/header";

export const metadata = {
  title: "My Blog Application",
  description: "A blog application built with Next.js and Material-UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <div className="container">

      <Header />
      <CssBaseline />

      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {children}
      </Container>
    </div>

  );
}
