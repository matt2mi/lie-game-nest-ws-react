import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PlayersModule } from '../players/players.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
    modules: [PlayersModule, QuestionsModule],
    components: [EventsGateway],
})
export class EventsModule {
}