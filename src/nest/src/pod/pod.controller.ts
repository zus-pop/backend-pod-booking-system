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
  PickType,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CreatePodDto, UpdatePodDto } from './dto';
import { PodService } from './pod.service';

@Controller('pods')
export class PodController {
  constructor(private readonly podService: PodService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Pod created' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(
    @Body() createPodDto: CreatePodDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createPodDto.image = image;
    return this.podService.create(createPodDto);
  }

  @Get()
  @ApiOkResponse({
    type: [
      PickType(CreatePodDto, [
        'pod_name',
        'description',
        'image',
        'type_id',
        'store_id',
        'pod_utilities',
      ]),
    ],
  })
  @ApiNotFoundResponse({ description: 'No pods found' })
  async findAll() {
    const pods = await this.podService.findAll();
    return pods;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Pod found' })
  @ApiNotFoundResponse({ description: 'Pod not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.podService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Pod updated' })
  @ApiNotFoundResponse({ description: 'Pod not found' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() updatePodDto: UpdatePodDto,
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
