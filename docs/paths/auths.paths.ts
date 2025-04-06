export const AuthsPaths = {
  "/api/auth/login": {
    post: {
      summary: "Authenticate user",
      description: "Authenticates a user and returns JWT tokens.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "neo@matrix.com"
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "Matrix1999!"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Successfully authenticated the user.",
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
                    example: "Hello Neo 👋"
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
                email: {
                  summary: "Email is missing or invalid",
                  value: {
                    status: 400,
                    error: "Email is required and must be a string"
                  }
                },
                password: {
                  summary: "Password is missing or invalid",
                  value: {
                    status: 400,
                    error: "Password is required and must be a string"
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
                    example: "Invalid credentials"
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
                no_sessions_collection: {
                  summary: "Collection 'sessions' not found",
                  value: {
                    status: 404,
                    error: "Collection 'sessions' not found"
                  }
                },
                no_users_collection: {
                  summary: "Collection 'users' not found",
                  value: {
                    status: 404,
                    error: "Collection 'users' not found"
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
        409: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 409
                  },
                  error: {
                    type: "string",
                    example: "User already authenticated"
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
                },
                creation_failed: {
                  summary: "Session creation failed",
                  value: {
                    status: 500,
                    error: "Session creation failed"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/auth/register": {
    post: {
      summary: "Register a new user",
      description: "Creates a new user and returns JWT tokens for authentication.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: {
                  type: "string",
                  example: "Neo"
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "neo@matrix.com"
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "Matrix1999!"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Successfully registered and authenticated the user.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 201
                  },
                  message: {
                    type: "string",
                    example: "Thank you Neo for creating an account 😍"
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
                email: {
                  summary: "Email is required",
                  value: {
                    status: 400,
                    error: "Email is required and must be a string"
                  }
                },
                name: {
                  summary: "Name is required",
                  value: {
                    status: 400,
                    error: "Name is required and must be a string"
                  }
                },
                password: {
                  summary: "Password is required",
                  value: {
                    status: 400,
                    error: "Password is required and must be a string"
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
                no_sessions_collection: {
                  summary: "Collection 'sessions' not found",
                  value: {
                    status: 404,
                    error: "Collection 'sessions' not found"
                  }
                },
                no_users_collection: {
                  summary: "Collection 'users' not found",
                  value: {
                    status: 404,
                    error: "Collection 'users' not found"
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
        409: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 409
                  },
                  error: {
                    type: "string",
                    example: "User already exists"
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
                },
                session_creation_failed: {
                  summary: "Session creation failed",
                  value: {
                    status: 500,
                    error: "Session creation failed"
                  }
                },
                user_registration_failed: {
                  summary: "User registration failed",
                  value: {
                    status: 500,
                    error: "User registration failed"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/auth/logout": {
    post: {
      summary: "Logout user and destroy session",
      description: "Logs out the user by deleting their session from the database and clearing authentication cookies.",
      tags: ["Auth"],
      responses: {
        200: {
          description: "Successfully logged out the user.",
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
                    example: "See you later Neo 👋"
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
                unable_to_extract_user_id_from_token: {
                  summary: "Unable to extract user ID from token",
                  value: {
                    status: 400,
                    error: "Unable to extract user ID from token"
                  }
                },
                unable_to_extract_user_name_from_token: {
                  summary: "Unable to extract user name from token",
                  value: {
                    status: 400,
                    error: "Unable to extract user name from token"
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
                    type: "string"
                  }
                }
              },
              examples: {
                invalid_refreshToken: {
                  summary: "Invalid refreshToken",
                  value: {
                    status: 401,
                    error: "Invalid refreshToken"
                  }
                },
                invalid_token: {
                  summary: "Invalid token",
                  value: {
                    status: 401,
                    error: "Invalid token"
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
                    example: "You can only disconnect your own account"
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
                no_session: {
                  summary: "Session not found or already deleted",
                  value: {
                    status: 404,
                    error: "Session not found or already deleted"
                  }
                },
                no_sessions_collection: {
                  summary: "Collection 'sessions' not found",
                  value: {
                    status: 404,
                    error: "Collection 'sessions' not found"
                  }
                },
                no_user: {
                  summary: "User not found",
                  value: {
                    status: 404,
                    error: "User not found"
                  }
                },
                no_users_collection: {
                  summary: "Collection 'users' not found",
                  value: {
                    status: 404,
                    error: "Collection 'users' not found"
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
  },
  "/api/auth/refresh-token": {
    get: {
      summary: "Refresh authentication token",
      description: "Generates a new JWT access token using a valid refresh token.",
      tags: ["Auth"],
      responses: {
        200: {
          description: "Successfully refreshed token.",
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
                    example: "Token is refreshed"
                  }
                }
              }
            }
          }
        },
        400: {
          description: "Unauthorized",
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
                    example: "No refresh token provided"
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
                    example: "Invalid refresh token"
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
                    type: "string",
                    example: [
                      "Collection 'sessions' not found",
                      "Collection 'users' not found",
                      "Session not found",
                      "User not found"
                    ]
                  }
                }
              },
              examples: {
                no_session: {
                  summary: "Session not found",
                  value: {
                    status: 404,
                    error: "Session not found"
                  }
                },
                no_sessions_collection: {
                  summary: "Collection 'sessions' not found",
                  value: {
                    status: 404,
                    error: "Collection 'sessions' not found"
                  }
                },
                no_user: {
                  summary: "User not found",
                  value: {
                    status: 404,
                    error: "User not found"
                  }
                },
                no_users_collection: {
                  summary: "Collection 'users' not found",
                  value: {
                    status: 404,
                    error: "Collection 'users' not found"
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
