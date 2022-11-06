import { Controller, Get, Req } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  @Get()
  async root(@Req() req: Request) {
    return 'Current date: ' + new Date();
  }
}
