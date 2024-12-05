import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Slot } from '@prisma/client';
import { Decimal, Sql } from '@prisma/client/runtime/library';
import { LuxonService } from '../../shared/luxon/luxon.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateSlotRequestDto, QuerySlotRequestDto } from './dto';
import { UpdateSlotRequestDto } from './dto/update-slot.dto';

@Injectable()
export class SlotService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly luxon: LuxonService,
  ) {}

  async generateBunchOfSlots(
    createSlotDto: CreateSlotRequestDto,
  ): Promise<Prisma.SlotCreateManyInput[]> {
    let startDateTime = this.luxon
      .getDateTimeFromISO(createSlotDto.start_date)
      .set({
        hour: createSlotDto.start_hour,
        minute: 0,
        second: 0,
      });

    const endDateTime = this.luxon
      .getDateTimeFromISO(createSlotDto.end_date)
      .set({
        hour: createSlotDto.end_hour,
        minute: 0,
        second: 0,
      });

    const slots: Prisma.SlotCreateManyInput[] = [];

    while (startDateTime < endDateTime) {
      const slot: Prisma.SlotCreateManyInput = {
        pod_id: createSlotDto.pod_id,
        start_time: startDateTime.toJSDate(),
        end_time: startDateTime
          .plus({ minutes: createSlotDto.duration_minutes })
          .toJSDate(),
        is_available: true,
        price: new Decimal(createSlotDto.price),
      };

      const overlappingSlots = await this.checkOverlappingSlots({
        pod_id: slot.pod_id,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });

      if (overlappingSlots.length) {
        const overlapDetail = this.getOverlapType({
          checkSlot: slot,
          overlappingSlots,
        });

        throw new BadRequestException({
          message: 'Overlapping slots',
          overlapDetail,
          newSlot: slot,
          error: 'Bad Request',
          statusCode: 400,
        });
      }

      slots.push(slot);

      if (createSlotDto.gap)
        startDateTime = startDateTime.plus({
          minutes: createSlotDto.duration_minutes + createSlotDto.gap,
        });
      else
        startDateTime = startDateTime.plus({
          minutes: createSlotDto.duration_minutes,
        });

      if (startDateTime.hour >= createSlotDto.end_hour) {
        startDateTime = startDateTime.plus({ day: 1 }).set({
          hour: createSlotDto.start_hour,
          minute: 0,
          second: 0,
        });
      }
    }
    return slots;
  }

  async checkOverlappingSlots(args: {
    pod_id: number;
    start_time: Date | string;
    end_time: Date | string;
  }) {
    const overlappingSlots = await this.prisma.slot.findMany({
      where: {
        AND: [
          {
            pod_id: args.pod_id,
          },
          {
            OR: [
              {
                AND: [
                  { start_time: { gte: args.start_time } },
                  { end_time: { lte: args.end_time } },
                ],
              },
              {
                AND: [
                  { start_time: { lte: args.start_time } },
                  { end_time: { gte: args.end_time } },
                ],
              },
              {
                AND: [
                  { start_time: { lte: args.start_time } },
                  { end_time: { gt: args.start_time } },
                ],
              },
              {
                AND: [
                  { start_time: { lt: args.end_time } },
                  { end_time: { gte: args.end_time } },
                ],
              },
            ],
          },
        ],
      },
      select: {
        slot_id: true,
        pod_id: true,
        start_time: true,
        end_time: true,
      },
    });

    return overlappingSlots;
  }

  getOverlapType(args: {
    checkSlot: Prisma.SlotCreateManyInput;
    overlappingSlots: {
      slot_id: number;
      pod_id: number;
      start_time: Date;
      end_time: Date;
    }[];
  }) {
    const { checkSlot, overlappingSlots } = args;

    return overlappingSlots.map((overlappingSlot) => {
      let overlapType: string;

      if (
        checkSlot.start_time <= overlappingSlot.start_time &&
        checkSlot.end_time >= overlappingSlot.end_time
      )
        overlapType = `New slot completely encompasses the existing slot`;
      else if (
        overlappingSlot.start_time <= checkSlot.start_time &&
        overlappingSlot.end_time >= checkSlot.end_time
      )
        overlapType = `Existing slot completely encompasses the new slot`;
      else if (
        checkSlot.start_time >= overlappingSlot.start_time &&
        checkSlot.start_time < overlappingSlot.end_time
      )
        overlapType = `New slot starts within the existing slot`;
      else overlapType = `New slot ends within the existing slot`;

      return {
        overlapType,
        overlappingSlot,
      };
    });
  }

  async create(createSlotDto: CreateSlotRequestDto) {
    const slots: Prisma.SlotCreateManyInput[] =
      await this.generateBunchOfSlots(createSlotDto);

    const createdSlots = this.prisma.slot.createMany({
      data: slots,
    });

    return createdSlots;
  }

  async findAll(options: { filters: QuerySlotRequestDto }) {
    const { filters } = options;

    const conditions: Sql[] = [];
    const columns: Sql = Prisma.join(
      [
        `slot_id`,
        `pod_id`,
        `start_time`,
        `end_time`,
        `is_available`,
        `price`,
      ].map((column) => Prisma.raw(column)),
      `, `,
    );
    const table: Sql = Prisma.raw(`Slot`);

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null) {
        switch (key) {
          case 'date':
            conditions.push(
              Prisma.sql`DATE(${Prisma.raw('start_time')}) = ${value}`,
            );
            break;
          case 'start_time':
            conditions.push(Prisma.sql`TIME(${Prisma.raw(key)}) >= ${value}`);
            break;
          case 'end_time':
            conditions.push(Prisma.sql`TIME(${Prisma.raw(key)}) <= ${value}`);
            break;
          case 'pod_id':
          case 'is_available':
          case 'price':
            conditions.push(Prisma.sql`${Prisma.raw(key)} = ${value}`);
            break;
          default:
            throw new Error(`${key} option is not supported`);
        }
      }
    });

    const where: Sql = conditions.length
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ` AND `)}`
      : Prisma.empty;

    const query: Sql = Prisma.sql`SELECT ${columns} FROM ${table} ${where}`;
    const slots = await this.prisma.$queryRaw<Slot[]>(query);

    if (!slots.length) {
      throw new NotFoundException('No slots found');
    }

    return slots.map((slot) => ({
      ...slot,
      price: new Prisma.Decimal(slot.price).toNumber(),
    }));
  }

  async findOne(id: number) {
    const slot = await this.prisma.slot.findUnique({
      where: {
        slot_id: id,
      },
    });

    if (!slot) throw new NotFoundException('Slot not found');

    return slot;
  }

  async update(id: number, updateSlotDto: UpdateSlotRequestDto) {
    try {
      const updatedSlot = await this.prisma.slot.update({
        where: {
          slot_id: id,
        },
        data: {
          price: updateSlotDto.price,
          is_available: updateSlotDto.is_available,
        },
      });
      return updatedSlot;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Slot not found');
      }
      throw err;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.slot.delete({
        where: {
          slot_id: id,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException('Slot not found');
      }
      throw err;
    }
  }
}
