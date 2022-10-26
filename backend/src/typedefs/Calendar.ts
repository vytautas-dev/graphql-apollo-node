export const typeCalender = `#graphql
type Events {
events: [String]
}

type Query {
    calendarEvents: Events
}


`;
