import User from "../models/User";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URL
);

export const calendarResolvers = {
  Query: {
    async calendarEvents<T>(parent: T, args: any, { req }: any) {
      const user = await User.findOne({ _id: req.session.passport.user });
      const refreshToken = user!.refreshToken;
      console.log(refreshToken);

      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.data.items;
      console.log(events);
    },
  },
};
