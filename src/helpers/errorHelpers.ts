import { Response, Request, NextFunction } from "express";

export class AppError extends Error {
    public statusCode: number;

    constructor(msg: string, statusCode?: number) {
        super(msg);
        this.statusCode = statusCode || 500;
    }
}

export function logError(statusCode: number, errorMessage: string) {
    console.error(`status: ${statusCode}, message: ${errorMessage}`);
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
        statusCode,
        message,
    });
}
