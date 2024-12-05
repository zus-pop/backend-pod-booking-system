import { Injectable, OnModuleInit } from '@nestjs/common';
import { DateTime, Settings } from 'luxon';

@Injectable()
export class LuxonService implements OnModuleInit {
  private readonly timezone = 'UTC';

  onModuleInit() {
    Settings.defaultZone = this.timezone;
    Settings.defaultLocale = 'vi-VN';
  }

  getCurrentTime() {
    return DateTime.now();
  }

  getDateTimeFromISO(iso: string) {
    return DateTime.fromISO(iso);
  }

  getDateTimeFromTimestamp(options: {
    milliseconds: number;
    hour: number;
    minute: number;
    second: number;
  }) {
    return DateTime.fromMillis(options.milliseconds).set({
      hour: options.hour,
      minute: options.minute,
      second: options.second,
    });
  }
}
