import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSlotRequestDto {
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @IsNumber()
  @IsNotEmpty()
  start_hour: number;

  @IsNumber()
  @IsNotEmpty()
  end_hour: number;

  @IsNumber()
  @IsNotEmpty()
  duration_minutes: number;

  @IsNumber()
  @IsNotEmpty()
  pod_id: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  gap?: number;
}

export class CreateSlotCreatedResponseDto {
  @IsNumber()
  count: number;
}

class OverlappingDetail {
  overlapType: string;
  overlappingSlots: OverlappingSlot[];
}

class OverlappingSlot {
  id: number;
  start_time: Date;
  end_time: Date;
}

export class CreateSlotBadRequestResponseDto {
  @IsNotEmpty()
  message: string;

  @ApiProperty({ type: [OverlappingDetail] })
  overlapDetail: {
    overlapType: string;
    overlappingSlots: {
      id: number;
      start_time: Date;
      end_time: Date;
    }[];
  };

  @IsObject()
  newSlot: {
    slot_id: number;
    pod_id: number;
    start_time: Date;
    end_time: Date;
  };

  @IsString()
  error: string = 'Bad Request';

  @IsNumber()
  statusCode: number = 400;
}
