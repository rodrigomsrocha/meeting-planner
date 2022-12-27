import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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
    await this.meetingsService.createMeeting(userId, data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getUserMeetings(@Request() req) {
    const userId = req.user['sub'];
    return await this.meetingsService.getUserMeetings(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:meetingId')
  async inviteUser(@Param('meetingId') meetingId: string, @Body() data) {
    return await this.meetingsService.inviteUser(data.guestId, meetingId);
  }
}
