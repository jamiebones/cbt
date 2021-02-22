import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";

const saltRounds = 10;

export default {
  Query: {
    loginUser: async (
      parent,
      { username, password },
      { models, secret, user }
    ) => {
      try {
        const userAccount = await models.User.findOne({
          username: username.toLowerCase(),
        });
        if (!userAccount) {
          return {
            type: "UserNotFoundError",
            message: "User details not found",
          };
        }
        const match = await bcrypt.compare(password, userAccount.password);
        if (!match) {
          //return error to userAccount to let them know the password is incorrect
          return {
            type: "FailedCredentialsError",
            message: "Incorrect credentials",
          };
        }

        const token = jwt.sign(
          {
            username: userAccount.username,
            id: userAccount.id,
            userType: userAccount.userType,
            name: userAccount.name,
          },
          secret
        );

        return {
          username: userAccount.id,
          id: userAccount.id,
          token: token,
          name: userAccount.name,
          userType: userAccount.userType,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },

  Mutation: {
    createUser: async (
      parent,
      { username, password, userType, name },
      { models, user }
    ) => {
      try {
        if (!user) {
          return {
            type: "NotLogginIn",
            message: "you must be login to create account",
          };
        }

        if (user.userType !== "super-admin") {
          return {
            type: "DontHavePriveledgeToCreateAccount",
            message: "only admins can create account",
          };
        }
        const userAccount = await models.User.findOne({
          username: username.toLowerCase(),
        });
        if (userAccount) {
          return {
            type: "AccountAlreadyExist",
            message: "Account alreay exist. Please use another username",
          };
        }
        //lets continue
        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new models.User({
          username: username.toLowerCase(),
          password: hash,
          userType: userType,
          name,
        });
        await newUser.save();
        return {
          id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          userType: newUser.userType,
        };
      } catch (error) {
        console.log(error);
        //throw error;
      }
    },
  },
  UserDetailsResult: {
    __resolveType(obj) {
      if (obj.type) {
        return "Error";
      }
      if (obj.name) {
        return "User";
      }
    },
  },
};
