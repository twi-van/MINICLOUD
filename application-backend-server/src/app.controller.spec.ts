import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsService } from './metrics.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, MetricsService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('hello', () => {
    it('should return hello payload with instance', () => {
      const body = appController.getHello() as { message?: string };
      expect(body.message).toContain('Hello');
    });
  });

  describe('metrics', () => {
    it('should expose prometheus text', () => {
      const text = appController.getMetrics();
      expect(text).toContain('app_up');
      expect(text).toContain('# TYPE');
    });
  });
});
