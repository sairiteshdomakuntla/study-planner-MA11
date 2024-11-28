import React from "react";
import { Grid, Typography, Button, Card, CardContent } from "@mui/material";

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: "#0d1b2a", color: "#fff", padding: "20px" }}>
      <Grid container spacing={4} style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* Header Section */}
        <Grid item xs={12} style={{ textAlign: "center", marginBottom: "20px" }}>
          <Typography variant="h2" gutterBottom>
            Welcome to Task Manager
          </Typography>
          <Typography variant="h6">
            Simplify, Track, and Manage Your Student Tasks Effortlessly!
          </Typography>
          {/* <Button
            variant="contained"
            style={{
              marginTop: "20px",
              backgroundColor: "#bb83d7",
              color: "#fff",
            }}
          >
            Get Started
          </Button> */}
        </Grid>

        {/* Features Section */}
        <Grid item xs={12}>
          <Typography variant="h4" style={{ marginBottom: "20px" }}>
            Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Task Tracking
                  </Typography>
                  <Typography>
                    Keep a detailed track of all your tasks, deadlines, and
                    progress in one place.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Smart Reminders
                  </Typography>
                  <Typography>
                    Get notified about your upcoming deadlines to stay ahead.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Visual Insights
                  </Typography>
                  <Typography>
                    You can even analyze your progress in this website.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Call to Action Section */}
        <Grid item xs={12} style={{ textAlign: "center", marginTop: "40px" }}>
          <Typography variant="h5">
            Ready to organize your tasks like a pro?
          </Typography>
          {/* <Button
            variant="contained"
            style={{
              marginTop: "20px",
              backgroundColor: "#bb83d7",
              color: "#0d1b2a",
            }}
          >
            Explore now
          </Button> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default LandingPage;