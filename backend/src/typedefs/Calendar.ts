export const typeCalendar = `#graphql

type End {
    dateTime: String,
    timeZone: String,
}

type Start {
    dateTime: String,
    timeZone: String,
}

type Event {
    summary: String
    organizer: String
    start: String
    end: String
    status: String
    hangoutLink: String
},

input EventInput {
    summary: String
    organizer: String
    start: String
    end: String
    status: String
    hangoutLink: String
}

type Query {
    calendarEvents: [Event] 
}

type Mutation {
    addEvent(eventInput: EventInput): Event
}

`;
