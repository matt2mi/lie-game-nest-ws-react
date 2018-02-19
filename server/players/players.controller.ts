import { Controller, Get, Res } from '@nestjs/common';
import { PlayersService } from './players.service';
import { QuestionsService } from '../questions/questions.service';

@Controller()
export class PlayersController {
    constructor(private readonly playersService: PlayersService,
                private readonly questionsService: QuestionsService) {
    }

    @Get('api/players')
    async players(@Res() res) {
        res.json(this.playersService.players);
    }

    @Get('api/nbMaxPlayers')
    async nbMaxPlayers(@Res() res) {
        res.json(this.playersService.maxPlayers);
    }

    @Get('api/question')
    async question(@Res() res) {
        res.json(this.questionsService.getQuestion(0));
    }

    @Get('api/results')
    async results(@Res() res) {
        res.json(this.playersService.calculateResults());
    }

    @Get('api/scores')
    async scores(@Res() res) {
        res.json(this.playersService.calculateScores());
    }
}
