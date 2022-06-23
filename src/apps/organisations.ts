import express from "express";
import cors from "cors";
import {
  createOrganisaton,
  getOrganisations,
} from "@/models/organisations/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { assertRoleMiddleware } from "@/middlewares";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.get(
  "/",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  getOrganisations
);
app.post(
  "/",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  createOrganisaton
);

// Expose Express API as a single Cloud Function:
export default app;
