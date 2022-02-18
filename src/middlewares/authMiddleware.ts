import { responseLocals } from "@/repositories";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import { NextFunction } from "express";
import { UNAUTHORIZED_STATUS_CODE } from "@/constants/response";
import { UserRoleEnum } from "@/types/auth";
import { getErrorResponse } from "@/utils/response";
import { auth } from "firebase-admin";

export const authMiddleware = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const organisationId = req.headers["x-organisation-id"] as string;
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .json(getErrorResponse(UNAUTHORIZED_STATUS_CODE));
  }

  let roles = [],
    allowedorganisationIds = [];
  try {
    const authResult = await auth().verifyIdToken(accessToken);
    roles = authResult.roles as UserRoleEnum[];
    allowedorganisationIds = authResult.organisationIds as string[];
  } catch (err) {
    console.log(err);
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .json(getErrorResponse(UNAUTHORIZED_STATUS_CODE));
  }

  if (!allowedorganisationIds.includes(organisationId)) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .json(getErrorResponse(UNAUTHORIZED_STATUS_CODE));
  }

  res.locals = { ...responseLocals, organisationId, roles };

  return next();
};
