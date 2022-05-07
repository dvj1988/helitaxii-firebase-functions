import express from "express";
import cors from "cors";
import {
  createMachine,
  deleteMachine,
  getMachine,
  getMachines,
  updateMachine,
} from "@/models/machines/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.get("/", getMachines);
app.post("/", createMachine);
app.get("/:machineId", getMachine);
app.put("/:machineId", updateMachine);
app.delete("/:machineId", deleteMachine);

// Expose Express API as a single Cloud Function:
export default app;
