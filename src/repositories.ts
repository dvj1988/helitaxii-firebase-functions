import { initializeApp } from "firebase-admin";
import { AircraftRepository } from "@/models/aircrafts/repository";
import { PilotRepository } from "@/models/pilots/repository";

initializeApp();

export const airportRepository = new AircraftRepository();
export const pilotRepository = new PilotRepository();

export const responseLocals = {
  airportRepository,
  pilotRepository,
};
