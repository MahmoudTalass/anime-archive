import { Response, Request, NextFunction } from "express";

export class AppError extends Error {
  public statusCode: number;

  constructor(msg: string, statusCode?: number) {
    super(msg);
    this.statusCode = statusCode || 500;
  }
}

export function logError(
  statusCode: number,
  errorMessage: string,
  functionName?: string
) {
  let message: string = `status: ${statusCode}, message: ${errorMessage}`;
  if (functionName) {
    message += `, occured in ${functionName}`;
  }
  console.error(message);
}

export function errorHandlingMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let statusCode: number = error instanceof AppError ? error.statusCode : 500;
  const message: string = error.message || "Something went wrong.";

  res.status(statusCode).json({
    error: {
      statusCode,
      message,
    },
  });
}
