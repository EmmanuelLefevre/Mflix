import { createSwaggerSpec } from "next-swagger-doc";

import { MovieSchema } from '@/docs/schemas/movie.schema';
import { TheaterSchema } from '@/docs/schemas/theater.schema';
import { UserSchema } from '@/docs/schemas/user.schema';

import { MoviesPaths } from '@/docs/paths/movies.paths';
import { TheatersPaths } from '@/docs/paths/theaters.paths';
import { UsersPaths } from '@/docs/paths/users.paths';


export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Mflix Movies list API",
        version: "1.0",
        description: "Julien Couraud TP",
        contact: {
          email: "julien.couraud@reseau-cd.net"
        }
      },
      paths: {
        ...MoviesPaths,
        ...TheatersPaths,
        ...UsersPaths
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          }
        },
        schemas: {
          Movie: MovieSchema,
          Theater: TheaterSchema,
          User: UserSchema
        }
      },
      security: [],
    }
  });

  return spec;
}
