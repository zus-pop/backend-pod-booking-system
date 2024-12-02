import { ArgumentMetadata, Logger, PipeTransform } from '@nestjs/common';

export class LoggerPipe implements PipeTransform {
  private readonly logger = new Logger(LoggerPipe.name);
  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log('metadata:', JSON.stringify(metadata));
    return value;
  }
}
