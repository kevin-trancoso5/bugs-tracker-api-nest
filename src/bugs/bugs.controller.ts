import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BugsService } from './bugs.service';
import { CreateBugDto } from './dtos/create_bug.dto';
import { UpdateBugDto } from './dtos/update_bug.dto';
import { BugStatus } from './enums/bug_status.enum';

@Controller('bugs')
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}

  @Post()
  create(@Body() createBugDto: CreateBugDto) {
    return this.bugsService.create(createBugDto);
  }

  @Get()
  findAll(
    @Query('severity', ParseIntPipe) severity?: number,
    @Query('status') status?: string,
    @Query('sortDate') sortDate?: 'ASC' | 'DESC',
  ) {
    return this.bugsService.findAll(severity, status, sortDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bugsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBugDto: UpdateBugDto) {
    return this.bugsService.update(id, updateBugDto);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() newStatus: string) {
    const normalizedStatus = newStatus.toUpperCase();
    const statusEnum = BugStatus[normalizedStatus as keyof typeof BugStatus];
    console.log(statusEnum);
    if (!statusEnum) {
      console.log('PAS IIC');
      throw new BadRequestException('Invalid status');
    }

    return this.bugsService.updateStatus(id, statusEnum);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bugsService.remove(id);
  }
}
