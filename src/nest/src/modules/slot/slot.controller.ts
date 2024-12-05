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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  CreateSlotBadRequestResponseDto,
  CreateSlotCreatedResponseDto,
  CreateSlotRequestDto,
  QuerySlotRequestDto,
  QuerySlotResponseDto,
  UpdateSlotRequestDto,
  UpdateSlotResponseDto,
} from './dto';
import { SlotService } from './slot.service';

@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreateSlotCreatedResponseDto,
    description: 'Number of slots created',
  })
  @ApiBadRequestResponse({
    type: CreateSlotBadRequestResponseDto,
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  create(@Body() createSlotDto: CreateSlotRequestDto) {
    return this.slotService.create(createSlotDto);
  }

  @Get()
  @ApiOkResponse({
    type: [QuerySlotResponseDto],
    description: 'List of slots',
  })
  @ApiNotFoundResponse({
    description: 'No slots found',
  })
  findAll(@Query() filters: QuerySlotRequestDto) {
    return this.slotService.findAll({
      filters,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    type: QuerySlotResponseDto,
    description: 'Slot details',
  })
  @ApiNotFoundResponse({
    description: 'Slot not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.slotService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: UpdateSlotResponseDto,
    description: 'Slot updated',
  })
  @ApiNotFoundResponse({
    description: 'Slot not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSlotDto: UpdateSlotRequestDto,
  ) {
    return this.slotService.update(id, updateSlotDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Slot deleted',
  })
  @ApiNotFoundResponse({
    description: 'Slot not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.slotService.remove(id);
  }
}
