import { Body, Controller, Get, Post, UseGuards, Req, Param } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get()
  getAll() {
    return this.listingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(req.user.id, createListingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-listings')
  getMyListings(@Req() req) {
    return this.listingsService.findByOperator(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }
}
