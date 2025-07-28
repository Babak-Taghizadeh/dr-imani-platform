import { NextResponse } from "next/server";

type ErrorResponseOptions<T = unknown> = {
  status?: number;
  details?: T;
  devDetails?: boolean;
};

type SuccessResponseData<T = unknown> = T;

export const successResponse = <T = unknown>(
  data: SuccessResponseData<T>,
  status = 200,
) => {
  return NextResponse.json(data, { status });
};

export const errorResponse = <T = unknown>(
  message: string,
  { status = 500, details, devDetails = false }: ErrorResponseOptions<T> = {},
) => {
  return NextResponse.json(
    {
      error: message,
      ...(devDetails && { details }),
    },
    { status },
  );
};

export const validateId = (id: string | number): number => {
  const numId = typeof id === "string" ? parseInt(id) : id;
  if (isNaN(numId)) {
    throw new Error("آیدی معتبر نیست.");
  }
  return numId;
};
