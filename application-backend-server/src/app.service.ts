import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
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
        const enrichById = new Map(
          this.readRoomsFile().map((r) => [r.id, r] as const),
        );
        return this.mapDbRow(result.rows[0], enrichById);
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

  /** A2 — lưu lịch hẹn (khớp schema Lợi: user_id/name/phone/visit_date). */
  async createBooking(input: {
    roomId: number;
    userSub: string;
    userEmail?: string;
    guestName: string;
    phone: string;
    visitDate: string;
    note?: string;
  }) {
    const pool = this.getPool();
    if (!pool) {
      throw new ServiceUnavailableException('Database chưa cấu hình');
    }

    const room = await pool.query(`SELECT id FROM rooms WHERE id = $1`, [
      input.roomId,
    ]);
    if (room.rowCount === 0) {
      throw new NotFoundException(`Room ${input.roomId} not found`);
    }

    const result = await pool.query(
      `INSERT INTO bookings (room_id, user_id, user_email, name, phone, visit_date, note, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING id, room_id, user_id, user_email, name, phone, visit_date, note, status, created_at`,
      [
        input.roomId,
        input.userSub,
        input.userEmail ?? null,
        input.guestName,
        input.phone,
        input.visitDate,
        input.note ?? '',
      ],
    );

    const row = result.rows[0];
    return {
      id: Number(row.id),
      roomId: Number(row.room_id),
      userId: row.user_id as string,
      userEmail: row.user_email as string | null,
      guestName: row.name as string,
      phone: row.phone as string,
      visitDate: row.visit_date,
      note: row.note as string,
      status: row.status as string,
      createdAt: row.created_at,
    };
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

  private mapDbRow(
    row: {
      id: string | number;
      title: string;
      address: string;
      price: string | number;
      area: string | number;
      description?: string;
      image_url?: string | null;
    },
    enrichById?: Map<number, Room>,
  ): Room {
    const id = Number(row.id);
    const fromFile = enrichById?.get(id);
    // A5 — DB thường chỉ có field cơ bản; ghép optional từ rooms.json cho filter FE
    return this.normalizeRoom({
      id,
      title: row.title,
      address: row.address,
      price: Number(row.price),
      area: Number(row.area),
      description: row.description ?? fromFile?.description ?? '',
      imageUrl:
        row.image_url ||
        fromFile?.imageUrl ||
        '/images/room-placeholder.svg',
      district: fromFile?.district,
      type: fromFile?.type,
      amenities: fromFile?.amenities,
      images: fromFile?.images,
      available: fromFile?.available,
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
      const enrichById = new Map(
        this.readRoomsFile().map((r) => [r.id, r] as const),
      );
      return result.rows.map((row) => this.mapDbRow(row, enrichById));
    } catch {
      return null;
    }
  }
}
