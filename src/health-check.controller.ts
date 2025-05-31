import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  @Get()
  isHealthy(): string {
    return 'Healthy !';
  }
}
