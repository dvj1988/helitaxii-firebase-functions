import { initializeApp, credential } from "firebase-admin";
import { MachineRepository } from "@/models/machines/repository";
import { PilotRepository } from "@/models/pilots/repository";
import { OrganisationRepository } from "@/models/organisations/repository";
import { AuthRepository } from "@/models/auth/repository";
import config from "@/config/prod.json";

initializeApp({
  credential: credential.cert({
    projectId: config.projectId,
    clientEmail: config.clientEmail,
    privateKey: config.privateKey,
  }),
  projectId: config.projectId,
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
