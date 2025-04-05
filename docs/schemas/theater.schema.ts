export const TheaterSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      example: "63f5b5fa6e7f16cdd60ab2a9"
    },
    theaterId: {
      type: "integer",
      example: 1000
    },
    location: {
      type: "object",
      properties: {
        address: {
          type: "object",
          properties: {
            street1: {
              type: "string",
              example: "340 W Market"
            },
            street2: {
              type: "string",
              example: "Ste backerstreet"
            },
            city: {
              type: "string",
              example: "Bloomington"
            },
            state: {
              type: "string",
              example: "MN"
            },
            zipcode: {
              type: "string",
              example: "55425"
            }
          }
        },
        geo: {
          type: "object",
          properties: {
            type: {
              type: "string",
              example: "Point"
            },
            coordinates: {
              type: "array",
              items: {
                type: "number"
              },
              example: [-93.24565, 44.85466]
            }
          }
        }
      }
    }
  }
};
