import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateBugDto {
  @ApiProperty({
    example: 'title',
    description: 'Title of your bug',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'description',
    description: 'Description of your bug',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Date of your bug',
    required: true,
  })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    example: '1',
    description: 'Severity of your bug',
    required: true,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  severity: number;
}
