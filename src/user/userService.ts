import { User } from "../user/userModel";

class UserService {
    private static instance: UserService | null = null;
    private constructor() {}

    static getInstance() {
        if (UserService.instance === null) {
            UserService.instance = new UserService();
        }
        return this.instance;
    }

    async getUser(identifierValue: string, identifierType: "email" | "id" | "username") {
        const user = await User.findOne({ [identifierType]: identifierValue });

        return user;
    }
}

export default UserService.getInstance();
