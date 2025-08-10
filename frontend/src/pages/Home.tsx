import React, { useState, useRef } from "react";
import ServoButton, { ServoButtonRef } from "../components/Auth/ServoButton";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Typography,
  Container,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Modal,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


interface HomeProps {
  userEmail: string;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ userEmail, onLogout }) => {
  const servoRef = useRef<ServoButtonRef>(null);
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  const handleLaterClick = () => {
    setOpen(true);
  };

  const handleSchedule = () => {
    if (!selectedTime) return;

    const now = dayjs();
    const diffMs = selectedTime.diff(now);

    if (diffMs <= 0) {
      alert("Please select a future time.");
      return;
    }

    setTimeout(() => {
      console.log("Triggering servo at scheduled time:", selectedTime.format("HH:mm"));
      servoRef.current?.triggerNow(); 
    }, diffMs);

    setOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Garage Helper</Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Box sx={{ mt: 4 }}>
          <ServoButton ref={servoRef} onLogout={onLogout} />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLaterClick}
            sx={{
              borderRadius: 3,
              padding: "10px 24px",
              marginTop: 6,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#4caf50cc",
                boxShadow: "0 6px 14px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            Later...
          </Button>
        </Box>
      </Container>

      {/* Modal for time selection */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 300,
          }}
        >
          <Typography variant="h6" align="center">Select Time</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Select Time"
              value={selectedTime}
              onChange={(newValue) => setSelectedTime(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={handleSchedule}
            disabled={!selectedTime}
          >
            Schedule
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Home;
