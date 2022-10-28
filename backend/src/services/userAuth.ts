const { google } = require("googleapis");
// import User from "../models/User";
const fs = require("fs");
const path = require("path");

const TOKEN_PATH = path.join(process.cwd(), "token.json");

export function loadSavedCredentialsIfExist() {
  const content = JSON.parse(fs.readFileSync(TOKEN_PATH));
  const client = google.auth.fromJSON(content);
  return client;
}

// export const userAuth = async () => {
//   const TOKEN_PATH = path.join(process.cwd(), "token.json");
//   const content = fs.readFileSync(TOKEN_PATH);
//   // const user = await User.findOne({ _id: "635926b49b190b340be04125" });
//
//   const refreshToken = content.toString();
//
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_OAUTH_REDIRECT_URL
//   );
//
//   oauth2Client.setCredentials({ refresh_token: refreshToken });
//   return oauth2Client;
// };
//
// const payload = {
//   type: "authorized_user",
//   client_id:
//     "104598434138-3dlgpk8edkmtm6lo0opsogr94s3c6td1.apps.googleusercontent.com",
//   client_secret: "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",
//   refresh_token:
//     "1//0cs5SPMYIiFEGCgYIARAAGAwSNwF-L9Ire2GHqjU2CXNwkE83SCVdeEg6X9DOtF5P1gbcRT_yPWlEofH_ouglbYbN-m4b0e8lGZY",
// };
