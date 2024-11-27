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
