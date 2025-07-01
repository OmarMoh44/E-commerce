import { findUserById } from "@services/prisma/user.service";
import { requireAuth } from "@middlewares/auth.middleware";
import { loginResolver } from "./auth/login.controller";
import { logoutResolver } from "./auth/logout.controller";
import { signupResolver } from "./auth/signup.controller";

export const resolvers = {
    Query: {
        async user(parent: any, args: any, context: any) {
            const { id, role } = requireAuth(context);
            console.log(id)
            const user = await findUserById(id);
            return user;
        }
    },
    Mutation: {
        login: loginResolver,
        logout: logoutResolver,
        signup: signupResolver
    }
};