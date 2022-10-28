import passport from "passport";
import { Request, Response } from "express";

const authUser = passport.authenticate("google", {
  scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
  accessType: "offline",
  prompt: "consent",
});

const callback = passport.authenticate("google", {
  successRedirect: "/graphql",
  failureMessage: "some error occured",
});

const logout = (req: Request, res: Response) => {
  req.session.destroy(function (err) {
    console.log(err);
  });
  res.redirect("/");
};

export default { authUser, callback, logout };
