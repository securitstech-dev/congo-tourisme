import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('operators/pending')
  getPendingOperators() {
    return this.adminService.getPendingOperators();
  }

  @Get('operators')
  getAllOperators() {
    return this.adminService.getAllOperators();
  }

  @Patch('operators/:id/validate')
  validateOperator(@Param('id') id: string) {
    return this.adminService.validateOperator(id);
  }

  @Patch('operators/:id/reject')
  rejectOperator(@Param('id') id: string) {
    return this.adminService.rejectOperator(id);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getGlobalStats();
  }
}
