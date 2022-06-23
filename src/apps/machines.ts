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
import { assertRoleMiddleware } from "@/middlewares";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.get("/", getMachines);
app.post("/", assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]), createMachine);
app.get("/:machineId", getMachine);
app.put(
  "/:machineId",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  updateMachine
);
app.delete(
  "/:machineId",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  deleteMachine
);

// Expose Express API as a single Cloud Function:
export default app;
