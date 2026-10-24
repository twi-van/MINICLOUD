import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  getHello() {
    return { message: 'Hello from App Server!'};
  }


  getStudent() {
    const filePath = join(process.cwd(),'students.json');
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  }  
}

