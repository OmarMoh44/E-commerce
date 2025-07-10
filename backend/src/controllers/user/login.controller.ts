import { verifyLogin } from "@services/auth/login.service";
import { validateEmail, validatePassword } from "@validators/user";
import { createToken, createTokenCookie } from "@services/token.service";

async function loginResolver(parent: any, args: any, context: any) {
    const { email, password } = args;
    const { res } = context;
    validateEmail(email);
    validatePassword(password);
    const user = await verifyLogin(email, password);
    const token = createToken(user.id, user.role);
    createTokenCookie(res, token);
    return user;
}

export { loginResolver };