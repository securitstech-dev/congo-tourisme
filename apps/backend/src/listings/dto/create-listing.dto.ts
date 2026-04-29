import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ListingType } from '@prisma/client';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ListingType)
  @IsNotEmpty()
  type: ListingType;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];
}
