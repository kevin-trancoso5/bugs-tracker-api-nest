import { Test, TestingModule } from '@nestjs/testing';
import { BugsController } from './bugs.controller';
import { BugsService } from './bugs.service';
import { BugStatus } from './enums/bug_status.enum';

describe('BugsController', () => {
  let controller: BugsController;
  let service: BugsService;
  const fixedDate = new Date('2025-01-01');

  const mockBugsService = {
    create: jest.fn((dto) => dto),
    findAll: jest.fn(() => [
      {
        id: '1',
        title: 'Test Bug',
        description: 'Test Description',
        date: fixedDate,
        severity: 1,
      },
    ]),
    findOne: jest.fn((id) => ({
      id,
      title: 'Test Bug',
      description: 'Test Description',
      date: fixedDate,
      severity: 1,
    })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    updateStatus: jest.fn((id, newStatus) => {
      const normalizedStatus = newStatus.toUpperCase();
      if (!(normalizedStatus in BugStatus)) {
        throw new Error(`Invalid status: ${normalizedStatus}`);
      }
      return {
        id,
        status: BugStatus[normalizedStatus as keyof typeof BugStatus],
      };
    }),
    remove: jest.fn((id) => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BugsController],
      providers: [
        {
          provide: BugsService,
          useValue: mockBugsService,
        },
      ],
    }).compile();

    controller = module.get<BugsController>(BugsController);
    service = module.get<BugsService>(BugsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a Bug', () => {
    const dto = {
      title: 'Test Bug',
      description: 'Test Description',
      date: fixedDate,
      severity: 1,
    };
    expect(controller.create(dto)).toEqual(dto);
  });

  it('should get all Bugs', () => {
    expect(controller.findAll()).toEqual([
      {
        id: '1',
        title: 'Test Bug',
        description: 'Test Description',
        date: fixedDate,
        severity: 1,
      },
    ]);
  });

  it('should get a Bug by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: '1',
      title: 'Test Bug',
      description: 'Test Description',
      date: fixedDate,
      severity: 1,
    });
  });

  it('should update a Bug', () => {
    const dto = { description: 'Updated Description' };
    expect(controller.update('1', dto)).toEqual({
      id: '1',
      description: 'Updated Description',
    });
  });

  it('should update status of a Bug', async () => {
    const newStatus = BugStatus.DONE;
    const result = await controller.updateStatus('1', newStatus);
    expect(result).toEqual({
      id: '1',
      status: BugStatus.DONE,
    });
  });

  it('should delete a Bug', () => {
    expect(controller.remove('1')).toEqual({ deleted: true });
  });
});
