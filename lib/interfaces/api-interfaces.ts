export interface CommentRouteContext {
  params: Promise<{ idMovie: string, idComment: string }>;
}

export interface MovieRouteContext {
  params: Promise<{ idMovie: string }>;
}

export interface TheaterRouteContext {
  params: Promise<{ idTheater: string }>;
}

export interface UserRouteContext {
  params: Promise<{ idUser: string }>;
}
