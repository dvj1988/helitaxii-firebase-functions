import express from "express";
import cors from "cors";
import {
  createPilot,
  createPilotFdtl,
  deletePilot,
  getPilots,
  getPilot,
} from "@/models/pilots/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.get("/", getPilots);
app.post("/", createPilot);
app.get("/:pilotId", getPilot);
app.delete("/:pilotId", deletePilot);
app.post("/:pilotId/fdtl", createPilotFdtl);

// Expose Express API as a single Cloud Function:
export default app;
