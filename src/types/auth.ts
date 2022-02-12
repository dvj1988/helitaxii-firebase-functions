export type CreateUserRequestBodyType = {
  email: string;
  password: string;
  role: "FDTL_ADMIN" | "FDTL_VIEWER";
};

export type UserRoleEnum = "FDTL_ADMIN" | "FDTL_VIEWER" | "DEVELOPER";
