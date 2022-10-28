import { google } from "googleapis";
import Settings from "../models/Settings";

export const loadClientAuth = async () => {
  const token = await Settings.find();

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  oauth2Client.credentials = {
    refresh_token: token[0].refreshToken,
  };

  return oauth2Client;
};
