import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
    showNotifications: true,
  });

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem("managerSettings", JSON.stringify(settings));
    Swal.fire("Settings saved successfully!");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Settings
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={handleChange}
                name="emailNotifications"
                color="primary"
              />
            }
            label="Email Notifications"
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 2, ml: 4 }}
          >
            Receive email notifications for important updates
          </Typography>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={handleChange}
                name="darkMode"
                color="primary"
              />
            }
            label="Dark Mode"
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 2, ml: 4 }}
          >
            Toggle dark mode for better visibility
          </Typography>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={settings.autoSave}
                onChange={handleChange}
                name="autoSave"
                color="primary"
              />
            }
            label="Auto Save"
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 2, ml: 4 }}
          >
            Automatically save changes
          </Typography>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={settings.showNotifications}
                onChange={handleChange}
                name="showNotifications"
                color="primary"
              />
            }
            label="Show Notifications"
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 2, ml: 4 }}
          >
            Show desktop notifications for updates
          </Typography>
        </FormGroup>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              bgcolor: "#fc6625",
              "&:hover": {
                bgcolor: "#e55a1c",
              },
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Settings;
