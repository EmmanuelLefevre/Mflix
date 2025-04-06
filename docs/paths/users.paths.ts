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
            example: "63f5b5fa6e7f16cdd60ab2a9"
          },
          description: "The ObjectId of the user to delete."
        }
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
                  }
                }
              }
            }
          }
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
                    type: "string"
                  }
                }
              },
              examples: {
                invalid_parameter: {
                  summary: "Invalid ID parameter",
                  value: {
                    status: 400,
                    error: "Invalid user ObjectID parameter format"
                  }
                },
                no_refreshToken: {
                  summary: "No refreshToken provided",
                  value: {
                    status: 400,
                    error: "No refreshToken provided"
                  }
                },
                no_token: {
                  summary: "No token provided",
                  value: {
                    status: 400,
                    error: "No token provided"
                  }
                },
                no_tokens_in_cookies: {
                  summary: "No tokens in cookies",
                  value: {
                    status: 400,
                    error: "No tokens found in cookies"
                  }
                },
                unable_to_extract_user_infos: {
                  summary: "Unable to extract user infos",
                  value: {
                    status: 400,
                    error: "Unable to extract user information from token"
                  }
                }
              }
            }
          }
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
                    example: "Invalid refreshToken"
                  }
                }
              }
            }
          }
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
                    example: "You can only delete your own account"
                  }
                }
              }
            }
          }
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
                    type: "string"
                  }
                }
              },
              examples: {
                no_collection: {
                  summary: "Collection not found",
                  value: {
                    status: 404,
                    error: "Collection 'users' not found"
                  }
                },
                no_user: {
                  summary: "No user",
                  value: {
                    status: 404,
                    error: "User not found"
                  }
                }
              }
            }
          }
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
                    example: "Method Not Allowed"
                  }
                }
              }
            }
          }
        },
        500: {
          description: "Internal Server Error",
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
                    type: "string"
                  }
                }
              },
              examples: {
                unknown: {
                  summary: "Unknown error",
                  value: {
                    status: 500,
                    error: "Unknown error occurred"
                  }
                },
                unexpected: {
                  summary: "Unexpected error",
                  value: {
                    status: 500,
                    error: "Instanceof Error"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
