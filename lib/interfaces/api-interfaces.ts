export interface MoviesRouteContext {
  params: Promise<{ idMovie: string }>;
}

export interface CommentsRouteContext {
  params: Promise<{ idMovie: string, idComment: string }>;
}

export interface TheaterRouteContext {
  params: Promise<{ idTheater: string }>;
}
