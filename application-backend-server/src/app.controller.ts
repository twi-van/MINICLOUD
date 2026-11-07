import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LabJwtAuthGuard } from './auth/lab-jwt-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MetricsService } from './metrics.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly metricsService: MetricsService,
  ) {}

  /** B1 — Prometheus scrape NestJS App (`text/plain` exposition). */
  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  getMetrics(): string {
    return this.metricsService.render();
  }

  @Get('hello')
  getHello() {
    return this.appService.getHello();
  }

  @Get('student')
  getStudent() {
    return this.appService.getStudent();
  }

  /** Đề mở rộng ③: đọc danh sách sinh viên từ database studentdb. */
  @Get('students-db')
  getStudentsDb() {
    return this.appService.getStudentsDb();
  }

  @Get('rooms')
  getRooms() {
    return this.appService.getRooms();
  }

  @Get('rooms/:id')
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getRoomById(id);
  }

  /** Đề: Bearer token từ realm MSSV + client flask-app. */
  @Get('secure')
  @UseGuards(LabJwtAuthGuard)
  getSecure(@Req() req: { user?: Record<string, unknown> }) {
    const user = req.user ?? {};
    return {
      message: 'Secure resource OK',
      preferred_username: user.preferred_username,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: { user?: Record<string, unknown> }) {
    const user = req.user ?? {};
    return {
      sub: user.sub,
      preferred_username: user.preferred_username,
      email: user.email,
      realm: 'realm_52400211',
    };
  }

  /** A2 — đặt lịch hẹn xem phòng (bắt buộc Bearer Keycloak). */
  @Post('bookings')
  @UseGuards(JwtAuthGuard)
  createBooking(
    @Req() req: { user?: Record<string, unknown> },
    @Body()
    body: {
      roomId?: number;
      guestName?: string;
      phone?: string;
      visitDate?: string;
    },
  ) {
    const userSub = String(req.user?.sub ?? '');
    if (!userSub) {
      throw new UnauthorizedException('Token thiếu sub');
    }
    if (!body.roomId || !body.guestName || !body.phone || !body.visitDate) {
      throw new BadRequestException(
        'Thiếu roomId / guestName / phone / visitDate',
      );
    }
    const userEmail =
      typeof req.user?.email === 'string' ? req.user.email : undefined;
    return this.appService.createBooking({
      roomId: Number(body.roomId),
      userSub,
      userEmail,
      guestName: body.guestName.trim(),
      phone: body.phone.trim(),
      visitDate: body.visitDate,
    });
  }
}
