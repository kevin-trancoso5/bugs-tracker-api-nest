import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommentDto } from './dtos/create_comment.dto';
import { UpdateCommentDto } from './dtos/update_comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    return this.commentsRepository.save(createCommentDto);
  }

  async findAll() {
    return this.commentsRepository.find();
  }

  async findOne(id: string) {
    return this.commentsRepository.findOneBy({ id });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.commentsRepository.update(id, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.commentsRepository.delete(id);
  }
}
