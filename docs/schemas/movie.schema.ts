export const MovieSchema = {
  components: {
    schemas: {
      Movie: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "573a1390f29313caabcd42e8"
          },
          plot: {
            type: "string",
            example: "A group of bandits stage a brazen train hold-up..."
          },
          genres: {
            type: "array",
            items: {
              type: "string"
            },
            example: ["Short", "Western"]
          },
          runtime: {
            type: "integer",
            example: 11
          },
          cast: {
            type: "array",
            items: {
              type: "string"
            },
            example: ["A.C. Abadie", "Gilbert M. 'Broncho Billy' Anderson"]
          },
          num_mflix_comments: {
            type: "integer",
            example: 0
          },
          title: {
            type: "string",
            example: "The Great Train Robbery"
          },
          fullplot: {
            type: "string",
            example: "Among the earliest existing films in American cinema..."
          },
          languages: {
            type: "array",
            items: {
              type: "string"
            },
            example: ["English"]
          },
          released: {
            type: "string",
            format: "date-time",
            example: "1903-12-01T00:00:00.000+00:00"
          },
          directors: {
            type: "array",
            items: {
              type: "string"
            },
            example: ["Edwin S. Porter"]
          },
          rated: {
            type: "string",
            example: "TV-G"
          },
          awards: {
            type: "object",
            properties: {
              wins: {
                type: "integer",
                example: 1
              },
              nominations: {
                type: "integer",
                example: 0
              },
              text: {
                type: "string",
                example: "1 win."
              }
            }
          },
          lastupdated: {
            type: "string",
            example: "2015-08-13 00:27:59.177000000"
          },
          year: {
            type: "integer",
            example: 1903
          },
          imdb: {
            type: "object",
            properties: {
              rating: {
                type: "number",
                example: 7.4
              },
              votes: {
                type: "integer",
                example: 9847
              },
              id: {
                type: "integer",
                example: 439
              }
            }
          },
          countries: {
            type: "array",
            items: {
              type: "string"
            },
            example: ["USA"]
          },
          type: {
            type: "string",
            example: "movie"
          },
          tomatoes: {
            type: "object",
            properties: {
              viewer: {
                type: "object",
                properties: {
                  rating: {
                    type: "number",
                    example: 3.7
                  },
                  numReviews: {
                    type: "integer",
                    example: 2559
                  },
                  meter: {
                    type: "integer",
                    example: 75
                  },
                  fresh: {
                    type: "integer",
                    example: 6
                  }
                }
              },
              critic: {
                type: "object",
                properties: {
                  rating: {
                    type: "number",
                    example: 7.6
                  },
                  numReviews: {
                    type: "integer",
                    example: 6
                  },
                  meter: {
                    type: "integer",
                    example: 100
                  },
                  rotten: {
                    type: "integer",
                    example: 0
                  }
                }
              }
            }
          },
          poster: {
            type: "string",
            example: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYt..."
          }
        }
      }
    }
  }
};
