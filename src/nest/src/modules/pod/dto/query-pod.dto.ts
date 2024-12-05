import { ApiProperty } from '@nestjs/swagger';
import { Pod_Type, Store, Utility } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class QueryPodRequestDto {
  @IsOptional()
  @IsString()
  pod_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  type_id?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  store_id?: number;
}

export class QueryPodResponseDto {
  @IsNumber()
  pod_id: number;

  @IsString()
  pod_name: string;

  @IsString()
  description: string;

  @IsString()
  @IsUrl()
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
}

export class QueryUniquePodResponseDto {
  @IsNumber()
  pod_id: number;

  @IsString()
  pod_name: string;

  @IsString()
  description: string;

  @IsString()
  @IsUrl()
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
  @ApiProperty({
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
  type: Pod_Type;

  @IsObject()
  @ApiProperty({
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
  store: Store;
}
