"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline } from "@mui/material";
import Header from "@/app/components/header";

// Создаем кэш для Material-UI
const muiCache = createCache({
  key: "mui",
  prepend: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">

    <CacheProvider value={muiCache}>
      <CssBaseline />
      <Header />
      {children}
    </CacheProvider>
    </div>
  );
}