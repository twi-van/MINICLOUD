import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello() {
    return this.appService.getHello();
  }

  @Get('student')
  getStudent() {
    return this.appService.getStudent();
  }

  @Get('rooms')
  getRooms() {
    return this.appService.getRooms();
  }

  @Get('rooms/:id')
  getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getRoomById(id);
  }
}
