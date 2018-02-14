import { Component } from '@nestjs/common';

export interface Player {
    id: number;
    pseudo: string;
}

@Component()
export class PlayersService {
    private readonly _maxPlayers = 3;
    get maxPlayers(): number {
        return this._maxPlayers;
    }

    private _players: Player[];
    get players(): Player[] {
        return this._players;
    }
    set players(players: Player[]) {
        this._players = players;
    }

    // private readonly liesMap: Map<string, string>; // ('mito', 'pseudo')
    // private readonly answersMap: Map<string, string[]>; // (lieValue: 'mito', ['pseudo'])
    // private readonly restartMap: Map<any, string>;
    // private readonly scores: { pseudo: string, scoreValue: number }[]; // [{pseudo: 'pseudo', scoreValue: 500}]

    constructor() {
        this.initAttributes();
    }

    initAttributes() {
        this._players = [];
    }

    addPlayer(pseudo: string) {
        this._players.push({id: this._players.length, pseudo: pseudo});
    }

    deletePlayer(pseudo: string) {
        if (this._players.length > 0) {
            const id = this.players.findIndex(player => player.pseudo === pseudo);
            this._players.splice(id, 1);
            this._players.map((player, id) => ({...player, id}));
        }
    }
}