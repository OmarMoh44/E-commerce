import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import { GraphQLError } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from "./schema/index";
import { resolvers } from "./controllers/index";
import { clearTokenCookie, getToken, verifyUserToken } from "@services/token.service";


dotenv.config();
async function main() {
    const app: Express = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (err) => { // error handling for all resolvers
            return {
                message: err.message,
                statusCode: err.extensions?.code || 500,
            };
        }
    });
    await server.start();

    app.use(
        cors({
            origin: process.env.NODE_ENV === 'production' 
                ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
                : ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
            optionsSuccessStatus: 200,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.JWT_SECRET as string,
            resave: false,
            saveUninitialized: true,
        })
    );

    app.use('/graphql', expressMiddleware(server, {
        //  this function aims to change global context through all resovlers to include some info of user in case of existed token
        context: async ({ req, res }) => {      // argument is old context
            let user = null;
            const token = getToken(req);
            if (token) {
                try {
                    const payload = verifyUserToken(token); // in case of invalid token, throw error
                    user = { id: payload.userId, role: payload.userRole };
                } catch (err) {
                    clearTokenCookie(res);
                    console.log('Authentication required');
                    throw new GraphQLError('Authentication required', {
                        extensions: { code: 'UNAUTHENTICATED' }
                    });
                }
            }
            return { req, res, user }; // new context that is global and shared at all resolvers
        }
    }
    ));

    const port = process.env.PORT as string;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

}
main()  // to use apollo server, open url: http://localhost:{port}/graphql