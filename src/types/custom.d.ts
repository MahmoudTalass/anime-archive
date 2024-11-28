import "jsonwebtoken";

declare global {
    namespace Express {
        export interface Request {
            user?: {
                id: string;
                username: string;
            };
        }
    }
}

declare module "jsonwebtoken" {
    export interface JwtPayload {
        username: string;
    }
}
