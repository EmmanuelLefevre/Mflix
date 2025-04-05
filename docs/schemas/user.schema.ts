export const UserSchema = {
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "63f5b5fa6e7f16cdd60ab2a9",
          },
          name: {
            type: "string",
            example: "Neo",
          },
          email: {
            type: "string",
            example: "neo@matrix.com",
          },
          password: {
            type: "string",
            example: "Matrix1999!",
          },
        },
      },
    },
  },
};
