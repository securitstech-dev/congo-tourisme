import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findOne(registerDto.email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role || 'TOURIST',
    });

    // Si c'est un opérateur, on crée son profil de base
    if (user.role === 'OPERATOR') {
      await this.prisma.operator.create({
        data: {
          userId: user.id,
          businessName: `${user.firstName} ${user.lastName}`, // Placeholder
          businessType: 'OTHER',
          description: 'Nouveau profil opérateur à compléter.',
          region: 'Congo',
          city: 'À préciser',
          address: 'À préciser',
          phone: '',
          subscriptionPlan: registerDto.plan as any || 'STARTER',
        },
      });
    }

    await this.mailService.sendWelcomeEmail(user.email, user.firstName);

    const { passwordHash, ...result } = user;
    return {
      user: result,
      backend_tokens: await this.generateTokens(user.id, user.email),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = user;
    return {
      user: result,
      backend_tokens: await this.generateTokens(user.id, user.email),
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }
}
