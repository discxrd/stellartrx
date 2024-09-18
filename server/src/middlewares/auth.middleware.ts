import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../user/entities/user.entity';

export class AuthMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    console.log(request.method, request.url, token);

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    const found = await User.find({
      where: { hash: token },
      relations: ['boosts', 'withdraws', 'referrals', 'completed_tasks'],
    });

    const user = found[0];

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    request.user = user;
    next();
  }
}
