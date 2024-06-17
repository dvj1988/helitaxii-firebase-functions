import express from "express";
import cors from "cors";

// Import the sub-apps
import pilotsApp from "./apps/pilots";
import machinesApp from "./apps/machines";
import organisationsApp from "./apps/organisations";

// Create the main Express app
const app = express();

// Apply CORS middleware
app.use(cors());

// Mount the sub-apps on specific paths
app.use("/pilots", pilotsApp);
app.use("/machines", machinesApp);
app.use("/organisations", organisationsApp);

// Optionally, add a home route
app.get("/", (req, res) => {
  res.send("Welcome to the Combined Node.js Server!");
});

// Set the port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
