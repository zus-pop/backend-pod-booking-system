import { ApiProperty } from '@nestjs/swagger';
import { Utility } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePodDto {
  @IsString()
  @IsOptional()
  pod_name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file',
  })
  @IsOptional()
  image?: Express.Multer.File;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  type_id?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  store_id?: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        utility_id: {
          type: 'number',
          example: 1,
        },
      },
    },
    description: 'Array of utility IDs',
  })
  @Transform(({ value }) => {
    if (!value) return value;

    if (typeof value === 'object') return value;

    const data = JSON.parse(value) as Pick<Utility, 'utility_id'>[];
    const resolvedData = data.map((item) => {
      if (typeof item === 'string') {
        try {
          // Parse JSON string into an object
          return JSON.parse(item);
        } catch (error) {
          console.error('Failed to parse JSON string:', error.message);
          throw new Error('Invalid JSON string in the input array');
        }
      }
      // If it's already an object, return it as is
      return item;
    });
    return resolvedData;
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  pod_utilities?: Pick<Utility, 'utility_id'>[];
}
