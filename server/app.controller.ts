import { Controller, Get, Res } from '@nestjs/common';
import { Player, PlayersService } from './services/players.service';

@Controller()
export class AppController {
    constructor(private readonly playersService: PlayersService) {
    }

    @Get()
    root(@Res() res): string {
        return res.render('/Users/mathieudeumie/projets/github/nest-api-ws/build/index.html');
    }

    @Get('api/players')
    async players(@Res() res) {
        const players: Player[] = this.playersService.players;
        console.log('players sent', players);
        res.json(players);
    }

    @Get('api/nbMaxPlayers')
    async nbMaxPlayers(@Res() res) {
        const maxPlayers = this.playersService.maxPlayers;
        console.log('maxPlayers sent', maxPlayers);
        res.json(maxPlayers);
    }
}
