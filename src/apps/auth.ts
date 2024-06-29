import express from "express";
import cors from "cors";
import { createUser } from "@/models/auth/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { assertRoleMiddleware } from "@/middlewares";
import bodyParser from "body-parser";
const app = express();

// Automatically allow cross-origin requests
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.post(
  "/users",
  assertRoleMiddleware(["FDTL_ADMIN", "DEVELOPER"]),
  createUser
);

// Expose Express API as a single Cloud Function:
export default app;
