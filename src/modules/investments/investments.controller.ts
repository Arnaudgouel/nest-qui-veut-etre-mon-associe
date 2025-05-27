import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.INVESTOR)
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Request() req: RequestWithUser) {
    return this.investmentsService.create(createInvestmentDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.INVESTOR)
  findAll(@Request() req: RequestWithUser) {
    return this.investmentsService.findAllByInvestor(req.user.id);
  }

  @Get('project/:id')
  findAllByProject(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.investmentsService.findAllByProject(id, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INVESTOR)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.investmentsService.remove(id, req.user.id);
  }
} 