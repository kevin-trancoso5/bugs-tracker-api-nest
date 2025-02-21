import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';

const mockCommentRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('CommentsService', () => {
  let service: CommentsService;
  let repo: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useFactory: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a comment', async () => {
    const dto = { bug_id: '123', username: 'Kevin', content: 'Test comment' };
    repo.save = jest.fn().mockResolvedValue(dto);

    const result = await service.create(dto);

    expect(result).toEqual(dto);
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(dto));
  });

  it('should retrieve all comments', async () => {
    const comments = [
      { id: '1', bug_id: '123', username: 'Kevin', content: 'Hello' },
    ];
    repo.find = jest.fn().mockResolvedValue(comments);

    const result = await service.findAll();

    expect(result).toEqual(comments);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should update a comment', async () => {
    const updatedComment = { content: 'Updated Content' };
    repo.update = jest.fn().mockResolvedValue(undefined);
    repo.findOneBy = jest.fn().mockResolvedValue(updatedComment);

    const result = await service.update('1', updatedComment);
    expect(repo.update).toHaveBeenCalledWith('1', updatedComment);
    expect(result).toEqual(updatedComment);
  });

  it('should delete a comment', async () => {
    repo.delete = jest.fn().mockResolvedValue(undefined);

    await service.remove('1');
    expect(repo.delete).toHaveBeenCalledWith('1');
  });
});
