import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

export type RoomListItem = {
  id: number;
  title: string;
  address: string;
  price: number;
  area: number;
  imageUrl: string | null;
};

export type RoomDetail = RoomListItem & {
  description: string;
};

@Injectable()
export class AppService {
  private pool: Pool | null | undefined;

  getHello() {
    return { message: 'Hello from App Server!' };
  }

  getStudent() {
    const filePath = join(process.cwd(), 'students.json');
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  }

  async getRooms(): Promise<RoomListItem[]> {
    const fromDb = await this.tryRoomsFromDb();
    if (fromDb) {
      return fromDb.map((r) => this.toListItem(r));
    }
    return this.readRoomsFile().map((r) => this.toListItem(r));
  }

  async getRoomById(id: number): Promise<RoomDetail> {
    const pool = this.getPool();
    if (pool) {
      try {
        const result = await pool.query(
          `SELECT id, title, address, price, area, description, image_url
           FROM rooms
           WHERE id = $1`,
          [id],
        );
        if (result.rowCount === 0) {
          throw new NotFoundException(`Room ${id} not found`);
        }
        return this.toDetail(this.mapDbRow(result.rows[0]));
      } catch (err) {
        if (err instanceof NotFoundException) {
          throw err;
        }
        // DB lỗi → fallback JSON
      }
    }

    const room = this.readRoomsFile().find((r) => r.id === id);
    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }
    return this.toDetail(room);
  }

  private readRoomsFile(): RoomDetail[] {
    const filePath = join(process.cwd(), 'rooms.json');
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as RoomDetail[];
  }

  private toListItem(room: RoomDetail): RoomListItem {
    return {
      id: Number(room.id),
      title: room.title,
      address: room.address,
      price: Number(room.price),
      area: Number(room.area),
      imageUrl: room.imageUrl ?? null,
    };
  }

  private toDetail(room: RoomDetail): RoomDetail {
    return {
      ...this.toListItem(room),
      description: room.description ?? '',
    };
  }

  private getPool(): Pool | null {
    if (this.pool !== undefined) {
      return this.pool;
    }

    const connectionString = process.env.DATABASE_URL;
    const host = process.env.POSTGRES_HOST || process.env.DB_HOST;

    if (!connectionString && !host) {
      this.pool = null;
      return this.pool;
    }

    this.pool = connectionString
      ? new Pool({ connectionString })
      : new Pool({
          host,
          port: Number(process.env.POSTGRES_PORT || process.env.DB_PORT || 5432),
          user: process.env.POSTGRES_USER || process.env.DB_USER || 'minicloud',
          password:
            process.env.POSTGRES_PASSWORD ||
            process.env.DB_PASSWORD ||
            'minicloud_dev',
          database: process.env.POSTGRES_DB || process.env.DB_NAME || 'minicloud',
        });

    return this.pool;
  }

  private mapDbRow(row: {
    id: string | number;
    title: string;
    address: string;
    price: string | number;
    area: string | number;
    description?: string;
    image_url?: string | null;
  }): RoomDetail {
    return {
      id: Number(row.id),
      title: row.title,
      address: row.address,
      price: Number(row.price),
      area: Number(row.area),
      description: row.description ?? '',
      imageUrl: row.image_url ?? null,
    };
  }

  private async tryRoomsFromDb(): Promise<RoomDetail[] | null> {
    const pool = this.getPool();
    if (!pool) {
      return null;
    }

    try {
      const result = await pool.query(
        `SELECT id, title, address, price, area, description, image_url
         FROM rooms
         ORDER BY id`,
      );
      return result.rows.map((row) => this.mapDbRow(row));
    } catch {
      return null;
    }
  }
}
