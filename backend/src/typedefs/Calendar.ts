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

// [
//     {
//         kind: 'calendar#event',
//         etag: '"3332696462692000"',
//         id: '6lgj6phl6gqm4b9kc8ojib9k60oj4bb1c4sj8b9l6dj64dpj6pgjachico',
//         status: 'confirmed',
//         htmlLink: 'https://www.google.com/calendar/event?eid=NmxnajZwaGw2Z3FtNGI5a2M4b2ppYjlrNjBvajRiYjFjNHNqOGI5bDZkajY0ZHBqNnBnamFjaGljbyB3b2pjaWVjaC5zemN6eWdpZWxza2k5MUBt',
//         created: '2022-10-21T10:30:31.000Z',
//         updated: '2022-10-21T10:30:31.346Z',
//         summary: 'King Gizzard & The Lizard Wizard • 11 marca 2023 • Warszawa',
//         description: 'Wydarzenie: fb://event/516416353157862\n' +
//             '\n' +
//             'King Gizzard & the Lizard Wizard w Polsce 11 marca 2023! Czy warszawska Progresja jest gotowa na potężną dawkę rocka? 🤘🎸\n' +
//             '\n' +
//     },
//     end: {
//     dateTime: '2023-03-11T14:00:00+01:00',
//         timeZone: 'Europe/Warsaw'
// },
// iCalUID: '6lgj6phl6gqm4b9kc8ojib9k60oj4bb1c4sj8b9l6dj64dpj6pgjachico@google.com',
//     sequence: 0,
//     reminders: { useDefault: false },
// eventType: 'default'
// }
// ]
