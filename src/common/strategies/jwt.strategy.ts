import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { hashString } from '../helpers/hash-string';
import { UserEntity } from '@/domain/user/entity/user.entity';

interface Payload {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly cfg: ConfigService<Cfg>,
    private readonly prisma: PrismaService,
    // private readonly crypto: CryptoService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.getOrThrow('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new ForbiddenException('Invalid token');

    const session = await this.prisma.session.findUnique({
      where: {
        token: hashString(token),
        expiresAt: { gte: new Date() },
        status: 'ACTIVE',
      },
    });
    if (!session) throw new ForbiddenException('Invalid token');

    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    });

    const uid = payload.sub;
    if (!uid) throw new ForbiddenException('Invalid token');

    const user = await this.prisma.user.findFirst({ where: { id: uid } });
    if (!user) throw new ForbiddenException('Invalid token');

    await this.prisma.session.updateMany({
      where: {
        user: { id: user.id },
        expiresAt: { lt: new Date() },
        status: 'ACTIVE',
      },
      data: { status: 'EXPIRED' },
    });

    return new UserEntity(user);
  }
}
