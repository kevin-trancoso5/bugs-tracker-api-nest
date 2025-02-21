import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn((dto) => dto),
    findAll: jest.fn(() => [
      { id: '1', bug_id: '123', username: 'Kevin', content: 'Test comment' },
    ]),
    findOne: jest.fn((id) => ({
      id,
      bug_id: '123',
      username: 'Kevin',
      content: 'Test',
    })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a comment', () => {
    const dto = { bug_id: '123', username: 'Kevin', content: 'Test comment' };
    expect(controller.create(dto)).toEqual(dto);
  });

  it('should get all comments', () => {
    expect(controller.findAll()).toEqual([
      { id: '1', bug_id: '123', username: 'Kevin', content: 'Test comment' },
    ]);
  });

  it('should get a comment by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: '1',
      bug_id: '123',
      username: 'Kevin',
      content: 'Test',
    });
  });

  it('should update a comment', () => {
    const dto = { content: 'Updated comment' };
    expect(controller.update('1', dto)).toEqual({
      id: '1',
      content: 'Updated comment',
    });
  });

  it('should delete a comment', () => {
    expect(controller.remove('1')).toEqual({ deleted: true });
  });
});
