import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MeetingsService } from '../meetings.service';

@WebSocketGateway({ cors: ['http://localhost:5173'] })
export class MeetingsGateway {
  constructor(private meetingsService: MeetingsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('invite')
  async handleNewInvatation(@MessageBody() data) {
    const meeting = await this.meetingsService.inviteUser(
      data.guestId,
      data.meetingId,
    );
    return meeting;
  }
}
