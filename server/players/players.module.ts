import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { QuestionsModule } from '../questions/questions.module';

@Module({
    modules: [QuestionsModule],
    controllers: [PlayersController],
    components: [PlayersService],
    exports: [PlayersService],
})
export class PlayersModule {
}