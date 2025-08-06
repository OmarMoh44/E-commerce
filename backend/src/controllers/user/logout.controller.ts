import { requireAuth } from "@middlewares/auth.middleware";
import { clearTokenCookie } from "@services/token.service";

export const logoutResolver = (parent: any, args: any, context: any) => {
    const user = requireAuth(context);
    const { res } = context;
    clearTokenCookie(res);
    return user;
}
