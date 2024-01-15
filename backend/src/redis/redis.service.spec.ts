import { Test, TestingModule } from '@nestjs/testing'
import { RedisService } from './redis.service'
import { ConfigService } from '@nestjs/config'

const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  duplicate: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
}

jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    ...mockRedisClient,
    duplicate: jest.fn().mockReturnValue({ ...mockRedisClient }),
  })),
}))

describe('RedisService', () => {
  let service: RedisService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'REDIS_HOST') return 'localhost'
              if (key === 'REDIS_PORT') return 6379
            }),
          },
        },
      ],
    }).compile()

    service = module.get<RedisService>(RedisService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should connect both pub and sub clients', async () => {
    await service.connect()
    expect(service.getPubClient().connect).toHaveBeenCalled()
    expect(service.getSubClient().connect).toHaveBeenCalled()
  })

  // 추가적인 테스트 케이스를 여기에 작성합니다.
})
