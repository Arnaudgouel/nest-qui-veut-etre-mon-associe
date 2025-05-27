import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InvestmentsService } from '../investments/investments.service';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly investmentsService: InvestmentsService,
  ) {}

  @Get('users')
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('investments')
  findAllInvestments() {
    return this.investmentsService.findAll();
  }
} 