export const TheatersPaths = {
  "/api/theaters": {
    get: {
      summary: "Retrieve theaters with pagination and limit",
      description: "Returns a paginated/limited list of theaters from the database.",
      tags: ["Theaters"],
      parameters: [
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
            minimum: 1,
            maximum: 50
          },
          description: "Number of theaters to return (between 1 and 50, default is 10)"
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
            minimum: 1
          },
          description: "Page number for pagination (default is 1)"
        }
      ],
      responses: {
        200: {
          description: "Successfully retrieved the list of theaters. Returns an empty array if no theaters are found.",
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
                      $ref: "#/components/schemas/Theater"
                    }
                  },
                  message: {
                    type: "string"
                  }
                }
              },
              examples: {
                success: {
                  summary: "Theaters found",
                  value: {
                    status: 200,
                    data: [
                      {
                        _id: "59a47286cfa9a3a73e51e72d",
                        theaterId: 1003,
                        location: {
                          address: {
                            street1: "340 W Market",
                            street2: "Ste backerstreet",
                            city: "Bloomington",
                            state: "MN",
                            zipcode: "55425"
                          },
                          geo: {
                            type: "Point",
                            coordinates: [-93.24565, 44.85466]
                          }
                        }
                      },
                      {
                        _id: "59a47286cfa9a3a73e51e72e",
                        theaterId: 1008,
                        location: {
                          address: {
                            street1: "1621 E Monte Vista Ave",
                            city: "Vacaville",
                            state: "CA",
                            zipcode: "95688"
                          },
                          geo: {
                            type: "Point",
                            coordinates: [-121.96328, 38.367649]
                          }
                        }
                      }
                    ]
                  }
                },
                no_theaters: {
                  summary: "No theaters found",
                  value: {
                    status: 200,
                    data: [],
                    message: "No theaters found"
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
                    example: "Invalid query parameters"
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
                    example: "Collection 'theaters' not found"
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
    },
    post: {
      summary: "Register a new theater",
      description: "Inserts a new theater into the theaters collection.",
      tags: ["Theaters"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
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
            }
          }
        }
      },
      responses: {
        201: {
          description: "Successfully added the theater.",
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
                    type: "string"
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Theater"
                    }
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
                missing_body: {
                  summary: "Missing or invalid request body",
                  value: {
                    status: 400,
                    error: "Request body is required and must be an object"
                  }
                },
                missing_location: {
                  summary: "Missing location in request body",
                  value: {
                    status: 400,
                    error: "Location is required and must be an object"
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
                    example: "Collection 'theaters' not found"
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
                    example: "Theater already exists"
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
  "/api/theaters/{Id}": {
    get: {
      summary: "Retrieve a theater by Id",
      description: "Fetches a theater based on the provided ObjectId.",
      tags: ["Theaters"],
      parameters: [
        {
          in: "path",
          name: "Id",
          required: true,
          schema: {
            type: "string",
            example: "59a47286cfa9a3a73e51e72d"
          },
          description: "The ObjectId of the theater to retrieve."
        }
      ],
      responses: {
        200: {
          description: "Successfully retrieved the theater. Returns an empty array if no theater is found.",
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
                      $ref: "#/components/schemas/Theater"
                    }
                  },
                  message: {
                    type: "string"
                  }
                }
              },
              examples: {
                success: {
                  summary: "Theater found",
                  value: {
                    status: 200,
                    data: [
                      {
                        _id: "59a47286cfa9a3a73e51e72d",
                        theaterId: 1003,
                        location: {
                          address: {
                            street1: "340 W Market",
                            street2: "Ste backerstreet",
                            city: "Bloomington",
                            state: "MN",
                            zipcode: "55425"
                          },
                          geo: {
                            type: "Point",
                            coordinates: [-93.24565, 44.85466]
                          }
                        }
                      }
                    ]
                  }
                },
                no_theater: {
                  summary: "Theater not found",
                  value: {
                    status: 200,
                    data: [],
                    message: "Theater not found"
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
                    example: "Invalid theater ObjectId parameter format"
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
                    example: "Collection 'theaters' not found"
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
    },
    put: {
      summary: "Update a theater by Id",
      description: "Updates the details of a theater based on the provided ObjectId.",
      tags: ["Theaters"],
      parameters: [
        {
          in: "path",
          name: "Id",
          required: true,
          schema: {
            type: "string",
            example: "59a47286cfa9a3a73e51e72d"
          },
          description: "The ObjectId of the theater to update."
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
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
            }
          }
        }
      },
      responses: {
        200: {
          description: "Successfully updated the theater.",
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
                    example: "Theater updated"
                  },
                  data: {
                    $ref: "#/components/schemas/Theater"
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
                    error: "Invalid theater ObjectID parameter format"
                  }
                },
                missing_body: {
                  summary: "Missing or invalid request body",
                  value: {
                    status: 400,
                    error: "Request body is required and must be an object"
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
                    status: 400,
                    error: "Collection 'theaters' not found"
                  }
                },
                no_theater: {
                  summary: "No theater",
                  value: {
                    status: 400,
                    error: "Theater not found"
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
    },
    delete: {
      summary: "Delete a theater by Id",
      description: "Deletes the theater with the specified ObjectId.",
      tags: ["Theaters"],
      parameters: [
        {
          in: "path",
          name: "Id",
          required: true,
          schema: {
            type: "string",
            example: "59a47286cfa9a3a73e51e72d"
          },
          description: "The ObjectId of the theater to delete."
        }
      ],
      responses: {
        200: {
          description: "Successfully deleted the theater.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {type: "integer",
                    example: 200
                  },
                  message: {type: "string",
                    example: "Theater deleted"
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
                    example: "Invalid theater ObjectID parameter format"
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
                    status: 400,
                    error: "Collection 'theaters' not found"
                  }
                },
                no_theater: {
                  summary: "No theater",
                  value: {
                    status: 400,
                    error: "Theater not found"
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
