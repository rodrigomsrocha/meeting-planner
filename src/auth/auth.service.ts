import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

interface GetTokensParams {
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { id, name, email } = await this.usersService.craeteUser(
      createUserDto,
    );
    const tokens = await this.getTokens({ userId: id, email, name });
    await this.updateRefreshToken(id, tokens.refreshToken);
    return tokens;
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.getUser({ where: { email } });
    const passwordMatch = bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
      throw new BadRequestException('Email or password incorrect');
    }

    const tokens = await this.getTokens({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.updateUser(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens({ userId, email, name }: GetTokensParams) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          name,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET_KEY,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          name,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET_KEY,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUser({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatch) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens({
      userId: user.id,
      name: user.name,
      email: user.email,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
