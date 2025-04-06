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
          description: "Bad Request - Missing required fields.",
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
                    example: [
                      "Email is required and must be a string",
                      "Password is required and must be a string"
                    ]
                  }
                }
              }
            }
          }
        },
        401: {
          description: "Unauthorized - Invalid credentials.",
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
                    example: "Invalid username or password"
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
                      "Collection 'users' not found"
                    ]
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
          description: "Bad Request - Missing required fields.",
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
                    example: [
                      "Email is required and must be a string",
                      "Password is required and must be a string",
                      "Name is required and must be a string"
                    ]
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
                      "Collection 'users' not found"
                    ]
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
          description: "Conflict - User already exists.",
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
                    type: "string",
                    example: [
                      "Invalid user ObjectID parameter format",
                      "No refreshToken provided",
                      "No token provided",
                      "No tokens found in cookies",
                      "No user ID found in token",
                      "Unable to extract user information from token"
                    ]
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
                    example: [
                      "Invalid refreshToken",
                      "Invalid token"
                    ]
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
                    type: "string",
                    example: [
                      "Collection 'sessions' not found",
                      "Collection 'users' not found",
                      "Session not found or already deleted",
                      "User not found"
                    ]
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
        401: {
          description: "Unauthorized - No refresh token provided or invalid.",
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
                    example: "No refresh token provided"
                  }
                }
              }
            }
          }
        },
        403: {
          description: "Forbidden - Invalid refresh token.",
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
