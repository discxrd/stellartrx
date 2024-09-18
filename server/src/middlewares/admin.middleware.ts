import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AdminMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    console.log(req.method, req.url, token);

    if (!token) {
      console.log('No admin token ');
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    if (
      token !==
      (process.env.TELEGRAM_ADMIN_BOT_TOKEN ||
        '6153701365:AAGPUcIT7usYc9vMlPPCIAZSMtXzCezKwv0')
    ) {
      console.log('Invalid admin token');
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}
