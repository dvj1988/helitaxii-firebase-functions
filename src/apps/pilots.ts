import express from "express";
import cors from "cors";
import {
  createPilot,
  createPilotFdtl,
  deletePilot,
  getPilots,
  getPilot,
  listPilotFdtl,
  updatePilot,
  getPilotFdtl,
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
app.put("/:pilotId", updatePilot);
app.delete("/:pilotId", deletePilot);
app.post("/:pilotId/fdtl", createPilotFdtl);
app.get("/:pilotId/fdtl", listPilotFdtl);
app.get("/:pilotId/fdtl/:fdtlId", getPilotFdtl);

// Expose Express API as a single Cloud Function:
export default app;
