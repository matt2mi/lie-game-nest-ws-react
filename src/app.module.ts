import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {CatsController} from './cats.controller';
import {EventsModule} from './events/events.module';

@Module({
    imports: [EventsModule],
    controllers: [AppController, CatsController],
    components: [],
})
export class ApplicationModule {
}
