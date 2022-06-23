import { ExpressRequest, ExpressResponse } from "@/types/express";
import { NextFunction } from "express";
import { UNAUTHORIZED_STATUS_CODE } from "@/constants/response";
import { UserRoleEnum } from "@/types/auth";
import { getErrorResponse } from "@/utils/response";

export const assertRoleMiddleware =
  (alowedRoles: UserRoleEnum[]) =>
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const { roles } = res.locals;

    let isRouteAllowed = false;

    alowedRoles.forEach((alowedRole) => {
      if (roles.includes(alowedRole)) {
        isRouteAllowed = true;
      }
    });

    if (isRouteAllowed) {
      return next();
    }

    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .json(getErrorResponse(UNAUTHORIZED_STATUS_CODE));
  };
