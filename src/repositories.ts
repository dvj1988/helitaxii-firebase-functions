const admin = require("firebase-admin");

import { MachineRepository } from "@/models/machines/repository";
import { PilotRepository } from "@/models/pilots/repository";
import { OrganisationRepository } from "@/models/organisations/repository";
import { AuthRepository } from "@/models/auth/repository";
import config from "@/config/prod.json";

admin.initializeApp({
  credential: admin.credential.cert(config),
});

export const machineRepository = new MachineRepository();
export const pilotRepository = new PilotRepository();
export const organisationRepository = new OrganisationRepository();
export const authRepository = new AuthRepository();

export const responseLocals = {
  machineRepository,
  pilotRepository,
  organisationRepository,
  authRepository,
};
