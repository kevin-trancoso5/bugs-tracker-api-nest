import { Test, TestingModule } from '@nestjs/testing';
import { BugsService } from './bugs.service';
import { Repository } from 'typeorm';
import { Bug } from './entities/bug.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { BugStatus } from './dtos/update_bug.dto';

const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }),
};

describe('BugsService', () => {
  let service: BugsService;
  let repository: Repository<Bug>;
  const fixedDate = new Date('2025-01-01');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BugsService,
        { provide: getRepositoryToken(Bug), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BugsService>(BugsService);
    repository = module.get<Repository<Bug>>(getRepositoryToken(Bug));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a bug', async () => {
      const bugData = {
        title: 'Test Bug',
        severity: 1,
        date: fixedDate,
      };
      mockRepository.save.mockResolvedValue(bugData);

      const result = await service.create(bugData);
      expect(result).toEqual(bugData);
      expect(repository.save).toHaveBeenCalledWith(bugData);
    });
  });

  describe('findAll', () => {
    it('should return a list of bugs', async () => {
      const mockBugs = [
        { id: '1', title: 'Test Bug', severity: 1, status: BugStatus.TODO },
      ];
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(mockBugs);

      const result = await service.findAll();
      expect(result).toEqual(mockBugs);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('bug');
    });

    it('should filter by severity', async () => {
      const mockBugs = [
        { id: '1', title: 'Test Bug', severity: 1, status: BugStatus.TODO },
      ];
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(mockBugs);

      const result = await service.findAll(1);
      expect(result).toEqual(mockBugs);
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'bug.severity = :severity',
        { severity: 1 },
      );
    });

    it('should filter by status', async () => {
      const mockBugs = [
        { id: '1', title: 'Test Bug', severity: 1, status: BugStatus.TODO },
      ];
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(mockBugs);

      const result = await service.findAll(undefined, 'todo');
      expect(result).toEqual(mockBugs);
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'bug.status = :status',
        { status: BugStatus.TODO },
      );
    });
  });

  describe('findOne', () => {
    it('should return a bug by id', async () => {
      const mockBug = {
        id: '1',
        title: 'Test Bug',
        severity: 1,
        status: BugStatus.TODO,
      };
      mockRepository.findOneBy.mockResolvedValue(mockBug);

      const result = await service.findOne('1');
      expect(result).toEqual(mockBug);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return null if bug not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne('99');
      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '99' });
    });
  });

  describe('update', () => {
    it('should update a bug and return the updated bug', async () => {
      const mockBug = {
        id: '1',
        title: 'Test Bug',
        severity: 1,
        status: BugStatus.TODO,
      };
      const updateData = { title: 'Updated Bug' };
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue({ ...mockBug, ...updateData });

      const result = await service.update('1', updateData);
      expect(result).toEqual({ ...mockBug, ...updateData });
      expect(repository.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should return null if bug not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.update('99', { title: 'Updated Bug' });
      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '99' });
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update the bug status', async () => {
      const mockBug = { id: '1', status: BugStatus.TODO };
      mockRepository.findOne.mockResolvedValue(mockBug);
      mockRepository.save.mockResolvedValue({
        ...mockBug,
        status: BugStatus.DONE,
      });

      const result = await service.updateStatus('1', BugStatus.DONE);
      expect(result).toEqual({ id: '1', status: BugStatus.DONE });
      expect(repository.save).toHaveBeenCalledWith({
        id: '1',
        status: BugStatus.DONE,
      });
    });

    it('should throw an error when moving status from TODO to VALIDATED', async () => {
      const mockBug = { id: '1', status: BugStatus.TODO };
      mockRepository.findOne.mockResolvedValue(mockBug);

      await expect(
        service.updateStatus('1', BugStatus.VALIDATED),
      ).rejects.toThrow(
        new BadRequestException('Cannot move status from TODO to VALIDATED'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a bug', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should return null if bug not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove('99');
      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith('99');
    });
  });
});
