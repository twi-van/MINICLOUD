import { Injectable } from '@nestjs/common';

/** B1 — Prometheus text exposition (không cần prom-client). */
@Injectable()
export class MetricsService {
  private httpRequestsTotal = 0;

  incHttpRequests() {
    this.httpRequestsTotal += 1;
  }

  render(): string {
    const instance =
      process.env.APP_INSTANCE ||
      process.env.INSTANCE_NAME ||
      process.env.HOSTNAME ||
      'application-backend-server';
    const mem = process.memoryUsage();
    const lines = [
      '# HELP app_up 1 if NestJS application process is running',
      '# TYPE app_up gauge',
      `app_up{instance="${instance}"} 1`,
      '',
      '# HELP process_uptime_seconds Time since the Node process started',
      '# TYPE process_uptime_seconds gauge',
      `process_uptime_seconds{instance="${instance}"} ${process.uptime().toFixed(3)}`,
      '',
      '# HELP process_resident_memory_bytes Resident memory size in bytes',
      '# TYPE process_resident_memory_bytes gauge',
      `process_resident_memory_bytes{instance="${instance}"} ${mem.rss}`,
      '',
      '# HELP app_http_requests_total Approximate HTTP requests handled by this process',
      '# TYPE app_http_requests_total counter',
      `app_http_requests_total{instance="${instance}"} ${this.httpRequestsTotal}`,
      '',
    ];
    return lines.join('\n');
  }
}
