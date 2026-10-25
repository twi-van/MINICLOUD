import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

/** Khớp FE (Hân): imageUrl là string; field thêm là optional. */
export type Room = {
  id: number;
  title: string;
  address: string;
  price: number;
  area: number;
  imageUrl: string;
  description?: string;
  district?: string;
  type?: string;
  amenities?: string[];
  images?: string[];
  available?: boolean;
};

@Injectable()
export class AppService {
  private pool: Pool | null | undefined;

  getHello() {
    return {
      message: 'Hello from App Server!',
      instance: process.env.APP_INSTANCE || 'default',
    };
  }

  getStudent() {
    const filePath = join(process.cwd(), 'students.json');
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  }

  async getRooms(): Promise<Room[]> {
    const fromDb = await this.tryRoomsFromDb();
    if (fromDb) {
      return fromDb;
    }
    return this.readRoomsFile();
  }

  async getRoomById(id: number): Promise<Room> {
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
        return this.mapDbRow(result.rows[0]);
      } catch (err) {
        if (err instanceof NotFoundException) {
          throw err;
        }
      }
    }

    const room = this.readRoomsFile().find((r) => r.id === id);
    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }
    return room;
  }

  private readRoomsFile(): Room[] {
    const filePath = join(process.cwd(), 'rooms.json');
    const raw = readFileSync(filePath, 'utf8');
    const list = JSON.parse(raw) as Room[];
    return list.map((r) => this.normalizeRoom(r));
  }

  private normalizeRoom(room: Partial<Room> & Record<string, unknown>): Room {
    return {
      id: Number(room.id),
      title: String(room.title ?? ''),
      address: String(room.address ?? ''),
      price: Number(room.price),
      area: Number(room.area),
      imageUrl:
        typeof room.imageUrl === 'string' && room.imageUrl.length > 0
          ? room.imageUrl
          : '/images/room-placeholder.svg',
      description:
        typeof room.description === 'string' ? room.description : undefined,
      district: typeof room.district === 'string' ? room.district : undefined,
      type: typeof room.type === 'string' ? room.type : undefined,
      amenities: Array.isArray(room.amenities)
        ? (room.amenities as string[])
        : undefined,
      images: Array.isArray(room.images) ? (room.images as string[]) : undefined,
      available:
        typeof room.available === 'boolean' ? room.available : undefined,
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
  }): Room {
    return this.normalizeRoom({
      id: Number(row.id),
      title: row.title,
      address: row.address,
      price: Number(row.price),
      area: Number(row.area),
      description: row.description ?? '',
      imageUrl: row.image_url || '/images/room-placeholder.svg',
    });
  }

  private async tryRoomsFromDb(): Promise<Room[] | null> {
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
