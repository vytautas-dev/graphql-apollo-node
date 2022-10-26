export const typeCalendar = `#graphql
type Events {
events: [String]
}

type Query {
    calendarEvents: Events
}
`;
