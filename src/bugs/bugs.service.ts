import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBugDto } from './dtos/create_bug.dto';
import { UpdateBugDto } from './dtos/update_bug.dto';

import { Bug } from './entities/bug.entity';
import { BugStatus } from './enums/bug_status.enum';

@Injectable()
export class BugsService {
  constructor(
    @InjectRepository(Bug)
    private bugsRepository: Repository<Bug>,
  ) {}

  async create(createBugDto: CreateBugDto) {
    return this.bugsRepository.save(createBugDto);
  }

  async findAll(severity?: number, status?: string, sortDate?: 'ASC' | 'DESC') {
    const query = this.bugsRepository.createQueryBuilder('bug');

    if (severity) {
      query.andWhere('bug.severity = :severity', { severity });
    }
    if (status) {
      query.andWhere('bug.status = :status', { status });
    }
    if (sortDate) {
      query.orderBy('bug.date', sortDate);
    }

    return query.getMany();
  }

  async findOne(id: string) {
    return this.bugsRepository.findOneBy({ id });
  }

  async update(id: string, updateBugDto: UpdateBugDto) {
    const bug = await this.bugsRepository.findOneBy({ id });
    if (!bug) {
      return null;
    }
    await this.bugsRepository.update(id, updateBugDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, newStatus: BugStatus) {
    const bug = await this.bugsRepository.findOne({ where: { id } });

    if (bug != null) {
      if (bug.status === BugStatus.TODO && newStatus === BugStatus.VALIDATED) {
        throw new BadRequestException(
          'Cannot move status from TODO to VALIDATED',
        );
      }

      bug.status = newStatus;
      return this.bugsRepository.save(bug);
    }
  }

  async remove(id: string) {
    await this.bugsRepository.delete(id);
  }
}
