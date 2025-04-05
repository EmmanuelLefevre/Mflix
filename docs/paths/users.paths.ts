export const UsersPaths = {
  "/api/users/{Id}": {
    delete: {
      summary: "Delete a user and associated session by Id",
      description: "Deletes the user and associated session with the specified ObjectId.",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "Id",
          required: true,
          schema: {
            type: "string",
            example: "63f5b5fa6e7f16cdd60ab2a9",
          },
          description: "The ObjectId of the user to delete.",
        },
      ],
      responses: {
        200: {
          description: "Successfully deleted the user and related session.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 200
                  },
                  message: {
                    type: "string",
                    example: "User and session data deleted"
                  },
                  farewell: {
                    type: "string",
                    example: "We will miss you Neo 👋"
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 400
                  },
                  error: {
                    type: "string",
                    example: "Invalid user ObjectID parameter format",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 401
                  },
                  error: {
                    type: "string",
                    example: "Invalid refreshToken",
                  },
                },
              },
            },
          },
        },
        403: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 403
                  },
                  error: {
                    type: "string",
                    example: "You can only delete your own account",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 404
                  },
                  error: {
                    type: "string",
                    example: "User not found",
                  },
                },
              },
            },
          },
        },
        405: {
          description: "Method Not Allowed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 405
                  },
                  error: {
                    type: "string",
                    example: "Method Not Allowed",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal Server Error.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 500
                  },
                  error: {
                    type: "string",
                    example: "Unexpected error occurred.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
