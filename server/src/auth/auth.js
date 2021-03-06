import passport from "passport";
import localStrategy from "passport-local";
import jwtStrategy from "passport-jwt";

import UserModel from "../models/UserModel";

// handle user registration
passport.use(
  "signup",
  new localStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (request, email, password, done) => {
      try {
        const { username } = request.body;
        const player = {
          playerName: username,
          attack: 25,
          defense: 10,
          maxHealth: 150,
          health: 150,
          frame: 0,
          key: "characters_1",
          gold: 20,
          items: null,
          equipedItems: null,
          exp: 0,
          maxExp: 100,
          level: 1,
          potions: 0,
        };
        const user = await UserModel.create({
          email,
          password,
          username,
          player,
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// handle user login
passport.use(
  "login",
  new localStrategy.Strategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          return done(new Error("user not found"), false);
        }

        if (!user.player) {
          return done(new Error("user not found"), false);
        }
        const valid = await user.isValidPassword(password);
        if (!valid) {
          return done(new Error("invalid password"), false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// verify jwt token
passport.use(
  new jwtStrategy.Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: (request) => {
        let token = null;
        if (request && request.cookies) token = request.cookies.jwt;
        return token;
      },
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
