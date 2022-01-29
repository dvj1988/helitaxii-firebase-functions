import { initializeApp } from "firebase-admin";
import { MachineRepository } from "@/models/machines/repository";
import { PilotRepository } from "@/models/pilots/repository";
import { OrganisationRepository } from "@/models/organisations/repository";

initializeApp();

export const machineRepository = new MachineRepository();
export const pilotRepository = new PilotRepository();
export const organisationRepository = new OrganisationRepository();

export const responseLocals = {
  machineRepository,
  pilotRepository,
  organisationRepository,
};
