import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createMeeting(@Request() req, @Body() data: CreateMeetingDto) {
    const userId = req.user['sub'];
    await this.meetingsService.createMeeting(userId, {
      ...data,
      host: {
        connect: { id: userId },
      },
    });
  }
}
