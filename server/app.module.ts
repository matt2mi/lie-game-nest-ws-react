import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';
import { PlayersService } from './services/players.service';

@Module({
    imports: [EventsModule],
    controllers: [AppController],
    components: [PlayersService],
})
export class ApplicationModule {
}
