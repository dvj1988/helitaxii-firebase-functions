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
  deletePilotFdtl,
} from "@/models/pilots/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { assertRoleMiddleware } from "@/middlewares";
import bodyParser from "body-parser";

const app = express();

// Automatically allow cross-origin requests
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.get("/", getPilots);
app.post("/", assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]), createPilot);
app.get("/:pilotId", getPilot);
app.put(
  "/:pilotId",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  updatePilot
);
app.delete(
  "/:pilotId",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  deletePilot
);
app.post(
  "/:pilotId/fdtl",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  createPilotFdtl
);
app.get("/:pilotId/fdtl", listPilotFdtl);
app.get("/:pilotId/fdtl/:fdtlId", getPilotFdtl);
app.delete("/:pilotId/fdtl/:fdtlId", deletePilotFdtl);

// Expose Express API as a single Cloud Function:
export default app;
