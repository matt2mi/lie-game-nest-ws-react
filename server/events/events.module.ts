import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PlayersModule } from '../players/players.module';

@Module({
    modules: [PlayersModule],
    components: [EventsGateway],
})
export class EventsModule {
}