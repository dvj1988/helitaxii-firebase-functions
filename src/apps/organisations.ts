import express from "express";
import cors from "cors";
import { responseLocals } from "@/repositories";
import {
  createOrganisaton,
  getOrganisations,
} from "@/models/organisations/resolvers";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use((req, res, next) => {
  res.locals = responseLocals;
  next();
});

// build multiple CRUD interfaces:
app.get("/", getOrganisations);
app.post("/", createOrganisaton);

// Expose Express API as a single Cloud Function:
export default app;
