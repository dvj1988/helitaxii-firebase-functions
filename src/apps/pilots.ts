import express from "express";
import cors from "cors";
import { responseLocals } from "@/repositories";
import {
  createPilot,
  createPilotFdtl,
  getPilots,
} from "@/models/pilots/resolvers";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use((req, res, next) => {
  res.locals = responseLocals;
  next();
});

// build multiple CRUD interfaces:
app.get("/organisation/:organisationId", getPilots);
app.post("/organisation/:organisationId", createPilot);
app.post("/:pilotId/organisation/:organisationId", createPilotFdtl);

app.delete("/:id/organisation/:organisationId", (req, res) =>
  res.json({ success: true, route: "DELETE pilots/:id" })
);

// Expose Express API as a single Cloud Function:
export default app;
