import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '@/domain/user/dto/sign-in.dto';
import { SignUpDto } from '@/domain/user/dto/sign-up.dto';
import { ResetPasswordDto } from '@/domain/user/dto/reset-password.dto';
import { UserEntity } from '@/domain/user/entity/user.entity';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { SessionEntity } from '@/domain/session/entity/session.entity';
import { hashString } from '@/common/helpers/hash-string';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signUp(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already in use');

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await bcrypt.hash(dto.password, await bcrypt.genSalt()),
      },
    });

    return new UserEntity(user);
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new BadRequestException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new BadRequestException('Invalid credentials');

    const payload = { sub: user.id, timestamp: Date.now() } as const;
    const token = await this.jwt.signAsync(payload, { expiresIn: '30d' });

    const { exp } = this.jwt.decode<{ exp: number }>(token);
    await this.prisma.session.create({
      data: {
        token: hashString(token),
        expiresAt: new Date(exp * 1000),
        user: { connect: { id: user.id } },
      },
    });

    return token;
  }

  async logout(user: UserEntity, token: string) {
    const hash = hashString(token);
    return new SessionEntity(
      await this.prisma.session.update({
        where: { token: hash, userId: user.id },
        data: { status: 'REVOKED' },
      }),
    );
  }

  async changePassword(user: UserEntity, dto: ResetPasswordDto) {
    if (dto.old === dto.new) {
      throw new BadRequestException('New password must be different');
    }

    if (!(await bcrypt.compare(dto.old, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const password = await bcrypt.hash(dto.new, await bcrypt.genSalt());
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password },
    });

    await this.prisma.session.updateMany({
      where: { userId: user.id, status: 'ACTIVE' },
      data: { status: 'REVOKED' },
    });

    return new UserEntity(user);
  }
}
