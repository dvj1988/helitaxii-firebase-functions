import express from "express";
import cors from "cors";
import {
  createPilot,
  createPilotFdtl,
  getPilots,
} from "@/models/pilots/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.get("/", getPilots);
app.post("/", createPilot);
app.post("/:pilotId", createPilotFdtl);

app.delete("/:id", (req, res) =>
  res.json({ success: true, route: "DELETE pilots/:id" })
);

// Expose Express API as a single Cloud Function:
export default app;
