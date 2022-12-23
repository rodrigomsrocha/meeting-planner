import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  meetingLink: string;

  @IsDate()
  @Type(() => Date)
  startsAt: Date;
}
