import { createSwaggerSpec } from "next-swagger-doc";

import { CommentSchema } from '@/docs/schemas/comment.schema';
import { MovieSchema } from '@/docs/schemas/movie.schema';
import { TheaterSchema } from '@/docs/schemas/theater.schema';
import { UserSchema } from '@/docs/schemas/user.schema';

import { AuthsPaths } from '@/docs/paths/auths.paths';
import { CommentsPaths } from '@/docs/paths/comments.paths';
import { MoviesPaths } from '@/docs/paths/movies.paths';
import { TheatersPaths } from '@/docs/paths/theaters.paths';
import { UsersPaths } from '@/docs/paths/users.paths';


export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Mflix",
        version: "1.0",
        description: "🎞️ Movies list Next.js API",
        contact: {
          email: "emmanuellefevre@protonmail.com"
        }
      },
      paths: {
        ...AuthsPaths,
        ...CommentsPaths,
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
          Comment: CommentSchema,
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
