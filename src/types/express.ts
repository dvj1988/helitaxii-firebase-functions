import { Request, Response } from "express";
import { responseLocals } from "@/repositories";
import * as core from "express-serve-static-core";
import { UserRoleEnum } from "./auth";

export interface ExpressResponse<ResBody = any>
  extends Response<
    ResBody,
    typeof responseLocals & { organisationId?: string; roles: UserRoleEnum[] }
  > {}

export interface ExpressRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {}
