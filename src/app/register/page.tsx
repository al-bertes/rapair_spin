"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, TextField, Typography, Alert, FormControlLabel, Checkbox } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

// ✅ Validation Schema (added termsAgreement)
const validationSchema = yup.object({
  name: yup.string().required("Please enter your name"),
  email: yup.string().email("Invalid email address").required("Please enter your email"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Please enter a password"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords do not match").required("Please confirm your password"),
  termsAgreement: yup.boolean().oneOf([true], "You must agree to the terms and privacy policy"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "", termsAgreement: false },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const { error } = await response.json();
          setError(error);
          return;
        }

        router.push("/login");
      } catch {
        setError("An error occurred during registration");
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField {...formik.getFieldProps("name")} label="Full Name" fullWidth required margin="normal"
            error={!!formik.errors.name} helperText={formik.errors.name} />
          <TextField {...formik.getFieldProps("email")} label="Email Address" fullWidth required margin="normal"
            error={!!formik.errors.email} helperText={formik.errors.email} />
          <TextField {...formik.getFieldProps("password")} label="Password" type="password" fullWidth required margin="normal"
            error={!!formik.errors.password} helperText={formik.errors.password} />
          <TextField {...formik.getFieldProps("confirmPassword")} label="Confirm Password" type="password" fullWidth required margin="normal"
            error={!!formik.errors.confirmPassword} helperText={formik.errors.confirmPassword} />

          {/* ✅ Terms Agreement Checkbox */}
          <FormControlLabel
            control={<Checkbox {...formik.getFieldProps("termsAgreement")} checked={formik.values.termsAgreement} />}
            label={
              <Typography variant="body2">
                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.
              </Typography>
            }
          />
          {formik.errors.termsAgreement && (
            <Typography variant="caption" color="error">
              {formik.errors.termsAgreement}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
        </Box>
      </Box>
    </Container>
  );
}
