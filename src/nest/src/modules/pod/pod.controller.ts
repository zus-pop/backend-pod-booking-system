import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { PaginationDto } from '../../shared/dto';
import {
  CreatePodRequestDto,
  CreatePodResponseDto,
  QueryPodRequestDto,
  QueryPodResponseDto,
  QueryUniquePodResponseDto,
  UpdatePodRequestDto,
  UpdatePodResponseDto,
} from './dto';
import { PodService } from './pod.service';

@Controller('pods')
export class PodController {
  constructor(private readonly podService: PodService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: CreatePodResponseDto,
    description: 'Pod created',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(
    @Body() createPodDto: CreatePodRequestDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createPodDto.image = image;
    return this.podService.create(createPodDto);
  }

  @Get()
  @ApiOkResponse({
    type: [QueryPodResponseDto],
    description: 'Pods found',
  })
  @ApiNotFoundResponse({ description: 'No pods found' })
  async findAll(
    @Query() filters: QueryPodRequestDto,
    @Query() pagination: PaginationDto,
  ) {
    const result = await this.podService.findAll({
      filters,
      pagination,
    });
    return result;
  }

  @Get(':id')
  @ApiOkResponse({
    type: QueryUniquePodResponseDto,
    description: 'Pod found',
  })
  @ApiNotFoundResponse({ description: 'Pod not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.podService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: UpdatePodResponseDto, description: 'Pod updated' })
  @ApiNotFoundResponse({ description: 'Pod not found' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() updatePodDto: UpdatePodRequestDto,
  ) {
    updatePodDto.image = image;
    return this.podService.update(id, updatePodDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Pod deleted' })
  @ApiNotFoundResponse({ description: 'Pod not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.podService.remove(id);
  }
}
