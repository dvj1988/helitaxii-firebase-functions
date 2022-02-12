import { auth } from "firebase-admin";

export class AuthRepository {
  constructor() {}

  async createUser({
    email,
    password,
    role,
    organisationId,
  }: {
    email: string;
    password: string;
    role: "FDTL_ADMIN" | "FDTL_VIEWER" | "DEVELOPER";
    organisationId: string;
  }) {
    const userRecord = await auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    return auth().setCustomUserClaims(userRecord.uid, {
      role,
      organisationId,
    });
  }
}
