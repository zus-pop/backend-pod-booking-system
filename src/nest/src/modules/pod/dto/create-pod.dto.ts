import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Pod_Type, Store, Utility } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePodRequestDto {
  @IsString()
  @IsNotEmpty()
  pod_name: string;

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
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  type_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  store_id: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        utility_id: {
          type: 'number',
          minProperties: 1,
          example: 1,
        },
      },
    },
    description: 'Array of utility IDs',
  })
  @Transform(({ value }) => {
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
  @ArrayNotEmpty()
  pod_utilities: Pick<Utility, 'utility_id'>[];
}

export class CreatePodResponseDto {
  @IsNumber()
  pod_id: number;

  @IsString()
  pod_name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsNumber()
  type_id: number;

  @IsNumber()
  store_id: number;

  @IsArray()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        utility_id: {
          type: 'number',
          minProperties: 1,
          example: 1,
        },
        utility_name: {
          type: 'string',
          example: 'Electricity',
        },
        description: {
          type: 'string',
          example: 'Electricity utility',
        },
      },
    },
  })
  pod_utilities: Utility[];

  @IsObject()
  @ApiPropertyOptional({
    type: 'object',
    properties: {
      type_id: {
        type: 'number',
        example: 1,
      },
      type_name: {
        type: 'string',
        enum: ['Single', 'Double', 'Meeting'],
        example: 'Double',
      },
      capacity: {
        type: 'number',
        example: 2,
      },
    },
  })
  type?: Pod_Type;

  @IsObject()
  @ApiPropertyOptional({
    type: 'object',
    properties: {
      store_id: {
        type: 'number',
        example: 1,
      },
      store_name: {
        type: 'string',
        example: 'Store Name',
      },
      address: {
        type: 'string',
        example: 'Store Address',
      },
      hotline: {
        type: 'string',
        example: 'Store Hotline',
      },
      image: {
        type: 'string',
        example: 'Store Image URL',
      },
    },
  })
  store?: Store;
}
