import express, {Express} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.use(
    cors({
        origin: function (origin, callback) {
            if (origin) {
                callback(null, origin);
            } else {
                callback(null, "*");
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.JWT_SECRET as string, // Change this to your secret
        resave: false,
        saveUninitialized: true,
    })
);
