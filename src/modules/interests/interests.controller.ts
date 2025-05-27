import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Public()
  @Get()
  findAll() {
    return this.interestsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findUserInterests(@Request() req: RequestWithUser) {
    return this.interestsService.findUserInterests(req.user.id);
  }
} 