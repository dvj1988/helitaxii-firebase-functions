import express from "express";
import cors from "cors";

// Import the sub-apps
import pilotsApp from "./apps/pilots";
import machinesApp from "./apps/machines";
import organisationsApp from "./apps/organisations";
import config from "@/config/prod.json";
import fdtlThresholdStore from "@/utils/fdtlThresholdStore";

// Create the main Express app
const app = express();

// Apply CORS middleware
app.use(cors());

// Mount the sub-apps on specific paths
app.use("/pilots", pilotsApp);
app.use("/machines", machinesApp);
app.use("/organisations", organisationsApp);

app.get("/fdtl-additional-time", (req, res) => {
  const currentDate = new Date();

  res.json([
    ...fdtlThresholdStore.getThresholds(),
    {
      date: currentDate.toISOString(),
      value: fdtlThresholdStore.getValueForDate(currentDate),
    },
  ]);
});

// Optionally, add a home route
app.get("/", (req, res) => {
  res.send(`Welcome to the Combined Node.js Server! ::${config.projectId}`);
});

// Set the port
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
