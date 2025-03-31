export interface MoviesRouteContext {
  params: { idMovie: string };
}

export interface CommentsRouteContext {
  params: { idMovie: string, idComment: string };
}

export interface TheaterRouteContext {
  params: { idTheater: string };
}
