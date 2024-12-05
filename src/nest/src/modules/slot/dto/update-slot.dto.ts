import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSlotRequestDto {
  @IsNumber()
  @IsOptional()
  price: number;

  @IsBoolean()
  @IsOptional()
  is_available: boolean;
}

export class UpdateSlotResponseDto {
  @IsNumber()
  slot_id: number;

  @IsNumber()
  pod_id: number;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  is_available: boolean;
}
