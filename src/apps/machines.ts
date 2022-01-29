import express from "express";
import cors from "cors";
import { responseLocals } from "@/repositories";
import { getMachines } from "@/models/machines/resolvers";
import { ExpressRequest, ExpressResponse } from "@/types/express";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use((req, res, next) => {
  res.locals = responseLocals;
  next();
});

// build multiple CRUD interfaces:
app.get("/organisation/:organisationId", getMachines);
app.post(
  "/organisation/:organisationId",
  (req: ExpressRequest, res: ExpressResponse) => {
    res.json({ success: true, route: "POST pilots/" });
  }
);
app.get("/:id/organisation/:organisationId", (req, res) =>
  res.json({ success: true, route: "GET pilots/:id" })
);
app.patch("/:id/organisation/:organisationId", (req, res) =>
  res.json({ success: true, route: "PATCH pilots/:id" })
);
app.delete("/:id/organisation/:organisationId", (req, res) =>
  res.json({ success: true, route: "DELETE pilots/:id" })
);

// Expose Express API as a single Cloud Function:
export default app;
