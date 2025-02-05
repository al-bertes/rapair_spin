"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { convertDate } from "../constants";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<
    { id: number; date: string; time: string; user: { name: string }; notes?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const decodedToken = JSON.parse(atob(token.split(".")[1])); // ✅ Decode JWT
        setIsAdmin(decodedToken.id === 1); // ✅ Check if the user is an admin

        const response = await fetch("/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data || []); // ✅ Ensure `data` is not null
      } catch (error) {
        console.error("❌ Error loading appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const deleteAppointment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You are not authorized.");
        return;
      }
  
      const response = await fetch(`/api/appointments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId: id }), // ✅ Pass the ID in the request body
      });
  
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error deleting appointment.");
        return;
      }
  
      setAppointments((prev) => prev.filter((a) => a.id !== id)); // ✅ Remove the deleted appointment from the list
      alert("Appointment successfully deleted.");
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
      alert("Error deleting appointment.");
    }
  };
  

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Appointments
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : appointments.length === 0 ? (
        <Typography color="text.secondary">No appointments available.</Typography>
      ) : (
        <List>
          {appointments.map(({ id, date, time, user, notes }) => (
            <React.Fragment key={id}>
              <ListItem>
                <ListItemText
                  primary={`🗓 ${convertDate(date)} ⏰ ${time}`}
                  secondary={`👤 ${user.name} ${notes ? `📌 ${notes}` : ""}`}
                />
                <Button variant="contained" color="error" onClick={() => deleteAppointment(id)}>
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}
