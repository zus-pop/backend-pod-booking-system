import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QuerySlotRequestDto {
  @IsNumberString()
  @IsOptional()
  @Transform(({ value }) => parseInt(value), {
    toClassOnly: false,
    toPlainOnly: true,
  })
  pod_id?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  start_time?: string;

  @IsString()
  @IsOptional()
  end_time?: string;

  @IsNumberString()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value), {
    toClassOnly: false,
    toPlainOnly: true,
  })
  price?: number;

  @IsBooleanString()
  @IsOptional()
  @Transform(({ value }) => value === 'true', {
    toClassOnly: false,
    toPlainOnly: true,
  })
  is_available?: boolean;
}

export class QuerySlotResponseDto {
  @IsNumber()
  slot_id: number;

  @IsNumber()
  pod_id: number;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsBoolean()
  is_available: boolean;

  @IsNumber()
  price: number;
}
