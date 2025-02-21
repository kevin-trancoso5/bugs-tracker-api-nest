import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { BugStatus } from '../enums/bug_status.enum';

export { BugStatus };

export class UpdateBugDto {
  @ApiProperty({
    example: 'title',
    description: 'Title of your bug',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'description',
    description: 'Description of your bug',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Date of your bug',
  })
  @IsOptional()
  date?: Date;

  @ApiProperty({
    example: '1',
    description: 'Severity of your bug',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  severity?: number;

  @ApiProperty({
    example: 'done',
    description: 'Status of your bug',
    enum: BugStatus,
  })
  @IsOptional()
  @IsEnum(BugStatus)
  status?: BugStatus;
}
