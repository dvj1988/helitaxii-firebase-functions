import express from "express";
import cors from "cors";
import { createMachine, getMachines } from "@/models/machines/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(authMiddleware);

// build multiple CRUD interfaces:
app.get("/", getMachines);
app.post("/", createMachine);
app.get("/:id", (req, res) =>
  res.json({ success: true, route: "GET pilots/:id" })
);
app.patch("/:id", (req, res) =>
  res.json({ success: true, route: "PATCH pilots/:id" })
);
app.delete("/:id", (req, res) =>
  res.json({ success: true, route: "DELETE pilots/:id" })
);

// Expose Express API as a single Cloud Function:
export default app;
