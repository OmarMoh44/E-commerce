import { createUser } from "@services/prisma/user.service";
import { UserInfo } from "@src/types/user";
import { validateSignUp } from "@validators/user"
import { createToken, createTokenCookie } from "@services/token.service";
import { createCart } from "@services/prisma/cart.service";


export const signupResolver = async (parent: any, args: any, context: any) => {
    const { res } = context;
    const userData: UserInfo = args.data;
    validateSignUp(userData);
    const user = await createUser(userData);
    await createCart(user.id);
    const token = createToken(user.id, user.role);
    createTokenCookie(res, token);
    return user;
}