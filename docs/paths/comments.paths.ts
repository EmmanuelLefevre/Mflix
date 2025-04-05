export const CommentsPaths = {
  "/api/movies/{IdMovie}/comments": {
    get: {
      summary: "Retrieve comments for a movie",
      description: "Returns a paginated list of comments for a specific movie.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "IdMovie",
          required: true,
          schema: {
            type: "string",
            example: "573a1390f29313caabcd446f"
          },
          description: "The ObjectID of the movie"
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
            minimum: 1,
            maximum: 50
          },
          description: "The number of comments to retrieve"
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
            minimum: 1
          },
          description: "The page number for pagination"
        }
      ],
      responses: {
        200: {
          description: "Successfully retrieved the list of movie comments. Returns an empty array if no comments are found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 200
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Comment"
                    }
                  }
                }
              },
              examples: {
                success: {
                  summary: "Comments found",
                  value: {
                    status: 200,
                    data: [
                      {
                        _id: "5a9427648b0beebeb69579e7",
                        name: "Mercedes Tyler",
                        email: "mercedes_tyler@fakegmail.com",
                        movie_id: "573a1390f29313caabcd4323",
                        text: "Eius veritatis vero facilis quaerat fuga temporibus.",
                        date: "2002-08-18T04:56:07.000+00:00"
                      },
                      {
                        _id: "5a9427648b0beebeb69579f5",
                        name: "John Bishop",
                        email: "john_bishop@fakegmail.com",
                        movie_id: "573a1390f29313caabcd446f",
                        text: "Id error ab at molestias dolorum incidunt.",
                        date: "1975-01-21T00:31:22.000+00:00"
                      }
                    ]
                  }
                },
                no_comments: {
                  summary: "No comments found",
                  value: {
                    status: 200,
                    data: [],
                    message: "No comments found"
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
                      "Invalid movie ObjectID parameter format",
                      "Invalid query parameters"
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
                      "Collection 'comments' not found",
                      "Collection 'movies' not found",
                      "Movie not found"
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
                    example: "Unexpected error occurred"
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Register a new comment for a movie",
      description: "Inserts a new comment into the comments collection for a specific movie.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "IdMovie",
          required: true,
          schema: {
            type: "string",
            example: "573a1390f29313caabcd446f"
          },
          description: "The ObjectID of the movie"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Thomas Morris"
                },
                email: {
                  type: "string",
                  example: "thomas_morris@fakegmail.com"
                },
                text: {
                  type: "string",
                  example: "Test first comment"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Successfully added the comment.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 201
                  },
                  data: {
                    $ref: "#/components/schemas/Comment"
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
                      "Name is required and must be a string",
                      "Email is required and must be a string",
                      "Invalid movie ObjectID parameter format",
                      "Text is required and must be a string"
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
                      "Collection 'comments' not found",
                      "Collection 'movies' not found",
                      "Movie not found"
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
                    example: "Unexpected error occurred"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "/api/movies/{idMovie}/comments/{id}": {
    get: {
      summary: "Retrieve a comment by Id",
      description: "Fetches a comment based on the provided ObjectId for a specific movie.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "idMovie",
          required: true,
          schema: {
            type: "string",
            example: "573a1390f29313caabcd446f"
          },
          description: "The ObjectId of the related movie."
        },
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            example: "67eb9bdad83c04fedec747e9"
          },
          description: "The ObjectId of the comment to retrieve."
        }
      ],
      responses: {
        200: {
          description: "Successfully retrieved the comment. Returns an empty array if no comment is found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 200
                  },
                  data: {
                    $ref: "#/components/schemas/Comment"
                  }
                }
              },
              examples: {
                success: {
                  summary: "Comment found",
                  value: {
                    status: 200,
                    data: [
                      {
                        _id: "5a9427648b0beebeb69579e7",
                        name: "Mercedes Tyler",
                        email: "mercedes_tyler@fakegmail.com",
                        movie_id: "573a1390f29313caabcd4323",
                        text: "Eius veritatis vero facilis quaerat fuga temporibus.",
                        date: "2002-08-18T04:56:07.000+00:00"
                      },
                      {
                        _id: "5a9427648b0beebeb69579f5",
                        name: "John Bishop",
                        email: "john_bishop@fakegmail.com",
                        movie_id: "573a1390f29313caabcd446f",
                        text: "Id error ab at molestias dolorum incidunt.",
                        date: "1975-01-21T00:31:22.000+00:00"
                      }
                    ]
                  }
                },
                no_comment: {
                  summary: "Comment not found",
                  value: {
                    status: 200,
                    data: [],
                    message: "Comment not found"
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
                      "Invalid comment ObjectId parameter format",
                      "Invalid movie ObjectId parameter format"
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
                      "Collection 'comments' not found",
                      "Collection 'movies' not found",
                      "Comment not found for this movie",
                      "Movie not found"
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
                    example: [
                      "Unexpected error occurred.",
                      "errorMessage"
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    put: {
      summary: "Update a comment by Id",
      description: "Updates the details of a comment for a specific movie based on the provided ObjectId.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "idMovie",
          required: true,
          schema: {
            type: "string",
            example: "573a1390f29313caabcd446f"
          },
          description: "The ObjectId of the related movie."
        },
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            example: "67eb9bdad83c04fedec747e9"
          },
          description: "The ObjectId of the comment to update."
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Neo"
                },
                email: {
                  type: "string",
                  example: "neo@matrix.com"
                },
                text: {
                  type: "string",
                  example: "Updated test comment"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Successfully updated the comment.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 200
                  },
                  data: {
                    $ref: "#/components/schemas/Comment"
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
                      "Invalid comment ObjectId parameter format",
                      "Invalid movie ObjectId parameter format",
                      "Request body is required and must be an object"
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
                      "Collection 'comments' not found",
                      "Collection 'movies' not found",
                      "Comment not found",
                      "Comment not found for this movie",
                      "Movie not found"
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
                    example: [
                      "Unexpected error occurred.",
                      "errorMessage"
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    delete: {
      summary: "Delete a comment by Id",
      description: "Deletes a comment associated with a specific movie based on the provided ObjectId.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "idMovie",
          required: true,
          schema: {
            type: "string",
            example: "573a1390f29313caabcd446f"
          },
          description: "The ObjectId of the related movie."
        },
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            example: "67eb9bdad83c04fedec747e9"
          },
          description: "The ObjectId of the comment to delete."
        }
      ],
      responses: {
        200: {
          description: "Successfully deleted the comment.",
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
                    example: "Comment deleted"
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
                      "Invalid comment ObjectID parameter format",
                      "Invalid movie ObjectID parameter format"
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
                      "Collection 'comments' not found",
                      "Collection 'movies' not found",
                      "Comment not found",
                      "Comment not found for this movie",
                      "Movie not found"
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
                    example: [
                      "Unexpected error occurred.",
                      "errorMessage"
                    ]
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
