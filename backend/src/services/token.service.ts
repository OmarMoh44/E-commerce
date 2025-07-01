import jwt from "jsonwebtoken";
import { Request, Response } from "express";

function createToken(userId: number, userRole: string) {
    try {
        const expiresIn = process.env.JWT_EXPIRE
        const userToken: string = jwt.sign(
            { id: userId, role: userRole, timestamp: Date.now() },
            process.env.JWT_SECRET as string,
            {
                expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
            }
        );
        return userToken;
    } catch (err: any) {
        throw new Error("User token creation failed");
    }
}

function createTokenCookie(res: Response, token: string) {
    res.cookie("token", token, {
        expires: new Date(
            Date.now() + parseInt(process.env.COOKIE_EXPIRE as string) * 1000 * 60 * 60
        ),
        httpOnly: true, //the cookie to be accessible only by the web server.
        secure: process.env.NODE_ENV === "production",
    });
}

function clearTokenCookie(res: Response) {
    res.clearCookie("token", {
        httpOnly: true,
    });
}

function getToken(req: Request) {
    if (req.cookies.token) {
        return req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        return req.headers.authorization.replace("Bearer", "").trim();
    } else {
        return undefined;
    }
}

function verifyUserToken(userToken: string) {
    const secret = process.env.JWT_SECRET as string;
    try {
        const payload = jwt.verify(userToken, secret) as { id: number; role: string };
        return { userId: payload.id, userRole: payload.role };
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}

export { createTokenCookie, clearTokenCookie, getToken, verifyUserToken, createToken };