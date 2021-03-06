import cors from "cors";
import express from "express";
import schema from "./schema";
import resolvers from "./resolvers";
import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import models from "./models";
import http from "http";
import config from "./config";
import uploadController from "./controllers/upload";

const morgan = require("morgan");

StartUp();

async function StartUp() {
  const app = express();
  app.use(cors());

  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined", { stream: config.winston.stream }));
  }

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError(err) {
    
      if (err instanceof AuthenticationError) {
        console.log("err", err)
        return err.message;
      }
      if (err instanceof UserInputError) {
        return new Error("Input not in the correct order");
      }
      if (err.message.startsWith("Database Error")) {
        return new Error("Internal server error");
      }
      console.log('this is an error' , err);
      return err
      //return new Error("There was an error");
    },
    context: async ({ req, connection }) => {
      const user = config.isAuth(req);
      const secret = config.keys.secret;
      console.log('the login user is', user );
      if (connection) {
        console.log("connection started here please");
        return { models, secret, req, user };
      }

      if (req) {
        return {
          user,
          models,
          secret,
          req,
        };
      }
    },
    playground: {
      settings: {
        "editor.theme": "light",
      },
    },
  });

  await config.startup();

  //router for uploading files
  app.use("/upload_question_with_image", uploadController);

  app.use(express.static("../uploads/images"));

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    config.winston.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
    res.status(err.status || 500);
  });

  server.applyMiddleware({ app, path: "/graphql" });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
  process.on("uncaughtException", function (err) {
    console.log("Uncaught Error: ", err);
  });
}
