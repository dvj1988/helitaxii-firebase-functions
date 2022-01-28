import express from "express";
import cors from "cors";
import { responseLocals } from "@/repositories";
import { getPilots } from "@/models/pilots/resolvers";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use((req, res, next) => {
  res.locals = responseLocals;
  next();
});

// build multiple CRUD interfaces:
app.get("/", getPilots);
app.post("/", (req, res) => res.json({ success: true, route: "POST pilots/" }));
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
