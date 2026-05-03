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
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    // Rotation du Refresh Token : on stocke le nouveau token en base
    // Note: Dans une version plus poussée, on pourrait invalider les anciens ici
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Vérifier si le token existe toujours en base (non révoqué)
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token invalide ou révoqué');
      }

      // Supprimer l'ancien token (rotation)
      await this.prisma.refreshToken.delete({
        where: { token },
      });

      // Générer de nouveaux tokens
      return this.generateTokens(payload.sub, payload.email);
    } catch (e) {
      throw new UnauthorizedException('Session expirée');
    }
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token },
    });
  }
}
