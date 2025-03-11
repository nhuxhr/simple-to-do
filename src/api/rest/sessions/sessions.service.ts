import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { UserEntity } from '@/domain/user/entity/user.entity';
import { hashString } from '@/common/helpers/hash-string';
import { SessionEntity } from '@/domain/session/entity/session.entity';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async sessions(user: UserEntity, token: string, page = 1, limit = 10) {
    if (page < 1) throw new BadRequestException('Page must greater than 0');
    if (limit < 1) throw new BadRequestException('Limit must greater than 0');
    if (limit > 100) throw new BadRequestException('Limit must less than 100');
    token = hashString(token);

    const where = Prisma.validator<Prisma.SessionWhereInput>()({
      user: { id: user.id },
    });

    const count = await this.prisma.session.count({ where });
    const items = await this.prisma.session.findMany({
      where,
      orderBy: [{ status: 'asc' }, { lastSeenAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items: items.map((item) => {
        const session = new SessionEntity(item).toJSON();
        session.current = item.token === token;
        return session;
      }),
      pagination: {
        page,
        pages: Math.ceil(count / limit),
        total: count,
        size: items.length,
      },
    };
  }

  async session(user: UserEntity, id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id, user: { id: user.id } },
    });
    if (!session) throw new NotFoundException('Session not found');
    return new SessionEntity(session);
  }

  async revoke(user: UserEntity, token: string, id: string) {
    const session = await this.session(user, id);
    token = hashString(token);
    if (session.token === token) {
      throw new BadRequestException('Cannot revoke current session');
    }
    if (session.status === 'EXPIRED') {
      throw new BadRequestException('Session already expired');
    }
    if (session.status === 'REVOKED') {
      throw new BadRequestException('Session already revoked');
    }
    return new SessionEntity(
      await this.prisma.session.update({
        where: { id: session.id },
        data: { status: 'REVOKED' },
      }),
    );
  }
}
