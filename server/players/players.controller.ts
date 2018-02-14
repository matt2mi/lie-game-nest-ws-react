import { Controller, Get, Res } from '@nestjs/common';
import { Player, PlayersService } from './players.service';

@Controller()
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {
    }

    @Get('api/players')
    async players(@Res() res) {
        const players: Player[] = this.playersService.players;
        res.json(players);
    }

    @Get('api/nbMaxPlayers')
    async nbMaxPlayers(@Res() res) {
        const maxPlayers = this.playersService.maxPlayers;
        res.json(maxPlayers);
    }
}
