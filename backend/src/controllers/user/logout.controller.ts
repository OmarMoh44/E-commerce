import { requireAuth } from "@middlewares/auth.middleware";
import { findUserById } from "@services/prisma/user.service";
import { clearTokenCookie } from "@services/token.service";

export const logoutResolver = async (parent: any, args: any, context: any) => {
    const { id } = requireAuth(context);
    const { res } = context;
    clearTokenCookie(res);
    const user = await findUserById(id);
    return user;
}
