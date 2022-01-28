import express from "express";
import cors from "cors";
import { firestoreDb } from "@/repositories";
import { getAircrafts } from "@/models/aircrafts/resolvers";
import { ExpressRequest, ExpressResponse } from "@/types/express";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use((req, res, next) => {
  res.locals = { firestoreDb };
  next();
});

// build multiple CRUD interfaces:
app.get("/", getAircrafts);
app.post("/", (req: ExpressRequest, res: ExpressResponse) => {
  res.json({ success: true, route: "POST pilots/" });
});
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
