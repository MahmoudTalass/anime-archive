import { User } from "../user/userModel";
import bcrypt from "bcrypt";

class AuthService {
    private static instance: AuthService | null = null;
    private constructor() {}

    static getInstance() {
        if (AuthService.instance === null) {
            AuthService.instance = new AuthService();
        }
        return this.instance;
    }

    async registerUser(username: string, email: string, password: string) {
        const hashedPassword = bcrypt.hash(password, 10);
        const user = new User({
            email,
            username,
            password: hashedPassword,
        });

        const addedUser = await user.save();

        return addedUser;
    }
}

export default AuthService.getInstance();
