import { google } from "googleapis";
import { IEventInput, IEvent } from "../types/types";
import { loadClientAuth } from "../services/oAuthClient";

export const calendarResolvers = {
  Event: {
    organizer: (event: IEvent) => event.organizer.email,
    start: (event: IEvent) => event.start.dateTime,
    end: (event: IEvent) => event.end.dateTime,
  },
  Query: {
    async calendarEvents<T>(parent: T, args: IEventInput, { req }) {
      const oauth2Client = await loadClientAuth();
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.data.items;
      return events;
    },
  },
  Mutation: {
    addEvent: async function <T>(parent: T, { eventInput }: IEventInput) {
      const { summary, organizer, start, end, status, hangoutLink } =
        eventInput;

      const oauth2Client = await loadClientAuth();
      const event = {
        summary: summary,
        organizer: {
          email: organizer,
        },
        start: {
          dateTime: start,
          timeZone: "Europe/Warsaw",
        },
        end: {
          dateTime: end,
          timeZone: "Europe/Warsaw",
        },
        status: status,
        hangoutLink: hangoutLink,
      };
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      calendar.events.insert(
        {
          auth: oauth2Client,
          calendarId: "primary",
          resource: event,
          visibility: "public",
        },
        function (err: any, event: any) {
          if (err) {
            console.log(
              "There was an error contacting the Calendar service: " + err
            );
            return;
          }
          console.log("Event created: %s", event.data.htmlLink);
        }
      );
      return event;
    },
  },
};

// {
//   "eventInput": {
//
//   "summary": "This is the summary",
//       "organizer": "This is the organizer",
//       "start": "2022-10-28T13:00:00-07:00",
//       "end": "2022-10-28T14:00:00-07:00",
//       "status": "confirmed",
//       "hangoutLink": "example.link.com"
//
// }
// }
