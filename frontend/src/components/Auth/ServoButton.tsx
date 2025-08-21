import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import api from "../../api/axios";
import axios from "axios";

// so we can call it from outside
export interface ServoButtonRef {
    triggerNow: () => Promise<void>;
  }
  
interface ServoButtonProps {
    onLogout: () => void;
}

const ServoButton = forwardRef<ServoButtonRef, ServoButtonProps>(({ onLogout }, ref) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const servoUrl = process.env.REACT_APP_SERVO_API;


    const handleClick = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            // logs action to db & triggers servo
            await api.post("/servo", {});
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to log action");
            if (err.response?.status === 401) {
                onLogout();
                navigate("/");
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        triggerNow: handleClick
      }));

    return (
        <div>
            <Button
                variant="contained"
                color={success ? "success" : "primary"}
                onClick={handleClick}
                disabled={loading}
                sx={{
                    borderRadius: 3,
                    padding: "10px 24px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                        backgroundColor: success ? "#4caf50cc" : "#1565c0",
                        boxShadow: "0 6px 14px rgba(0, 0, 0, 0.25)",
                    },
                }}
            >
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : success ? (
                    "Logged!"
                ) : (
                    "Now!"
                )}
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
});

export default ServoButton;
