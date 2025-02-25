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
  UseGuards,
} from '@nestjs/common';
import { BugsService } from './bugs.service';
import { CreateBugDto } from './dtos/create_bug.dto';
import { UpdateBugDto } from './dtos/update_bug.dto';
import { BugStatus } from './enums/bug_status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bugs')
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBugDto: UpdateBugDto) {
    return this.bugsService.update(id, updateBugDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: BugStatus,
  ) {
    return this.bugsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bugsService.remove(id);
  }
}
