import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Module({
    components: [QuestionsService],
    exports: [QuestionsService],
})
export class QuestionsModule {
}