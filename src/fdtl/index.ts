import express from "express";
import cors from "cors";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.get("/:id", (req, res) => res.json({ success: true }));

// Expose Express API as a single Cloud Function:
export default app;
