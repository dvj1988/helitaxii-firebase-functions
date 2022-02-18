import { PaginationQueryType, PaginationType } from "@/types/common";
import { isNumber } from "lodash";

export const isPaginationObjectValid = (pagination: PaginationType) => {
  return (
    isNumber(pagination.pageNumber) &&
    !isNaN(pagination.pageNumber) &&
    isNumber(pagination.pageSize) &&
    !isNaN(pagination.pageSize) &&
    pagination.pageSize <= 10 &&
    pagination.pageSize > 0 &&
    pagination.pageNumber > 0
  );
};

export const getParsedPaginationParams = (
  pagination: PaginationQueryType
): PaginationType => {
  return {
    pageSize: parseInt(pagination.pageSize, 10),
    pageNumber: parseInt(pagination.pageNumber, 10),
  };
};
