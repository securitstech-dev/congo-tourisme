import { Controller, Get, UseGuards, Req, Body, Patch, NotFoundException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OperatorsService } from './operators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Controller('operators')
@UseGuards(JwtAuthGuard)
export class OperatorsController {
  constructor(
    private operatorsService: OperatorsService,
    private cloudinaryService: CloudinaryService
  ) {}

  @Get('me')
  getMe(@Req() req) {
    return this.operatorsService.findByUserId(req.user.id);
  }

  @Get('stats')
  async getStats(@Req() req) {
    return this.operatorsService.getStats(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Req() req, @Body() data: any) {
    const operator = await this.operatorsService.findByUserId(req.user.id);
    if (!operator) {
      throw new NotFoundException('Profil opérateur non trouvé');
    }
    return this.operatorsService.update(operator.id, data);
  }

  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string
  ) {
    const operator = await this.operatorsService.findByUserId(req.user.id);
    if (!operator) throw new NotFoundException('Opérateur non trouvé');

    const result = await this.cloudinaryService.uploadFile(file, 'operators/documents');
    return this.operatorsService.uploadDocument(
      operator.id,
      type as any,
      result.url,
      result.public_id
    );
  }
}
