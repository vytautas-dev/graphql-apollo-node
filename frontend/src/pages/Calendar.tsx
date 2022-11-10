import React from "react";
import { useQuery, gql } from "@apollo/client";

const bookInput = {
  limit: 10,
  offset: 0,
};

const GET_BOOKS = gql`
  query Books($bookInput: BookInput) {
    books(bookInput: $bookInput) {
      _id
      user
      author
      title
      description
      genre
    }
  }
`;

function Calendar() {
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: { bookInput },
  });

  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
  }

  return data?.books?.map(({ _id, author, title, description }: any) => (
    <div key={_id}>
      <h3>{title}</h3>
      <br />
      <b>About this book:</b>
      <p>{author}</p>
      <p>{description}</p>
      <br />
    </div>
  ));
}

export default Calendar;
