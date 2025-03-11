declare namespace Express {
  interface Request {
    user?: import('@/domain/user/entity/user.entity').UserEntity;
  }
}
