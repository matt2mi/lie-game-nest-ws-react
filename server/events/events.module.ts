import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PlayersService } from '../services/players.service';

@Module({
    components: [PlayersService, EventsGateway],
})
export class EventsModule {}