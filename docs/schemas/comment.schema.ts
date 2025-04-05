export const CommentSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      example: "5a9427648b0beebeb6957a88"
    },
    name: {
      type: 'string',
      example: "Thomas Morris"
    },
    email: {
      type: 'string',
      example: "thomas_morris@fakegmail.com"
    },
    movie_id: {
      type: 'string',
      example: "573a1390f29313caabcd680a"
    },
    text: {
      type: 'string',
      example: "Perspiciatis sequi nesciunt maiores. Molestiae earum odio voluptas."
    },
    date: {
      type: 'string',
      format: 'date-time',
      example: "1995-07-16T01:13:12.000+00:00"
    }
  }
};
