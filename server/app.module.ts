import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';
import { PlayersModule } from './players/players.module';

@Module({
    imports: [EventsModule, PlayersModule],
    controllers: [AppController],
})
export class ApplicationModule {
}
