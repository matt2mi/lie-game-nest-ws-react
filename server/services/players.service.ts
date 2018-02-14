import { Component } from '@nestjs/common';

export interface Player {
    id: number;
    pseudo: string;
}

@Component()
export class PlayersService {
    private readonly _maxPlayers = 2;

    constructor() {
        this.initAttributes();
    }

    get maxPlayers(): number {
        return this._maxPlayers;
    }

    private _players: Player[];

    get players(): Player[] {
        return this._players;
    }

    set players(players: Player[]) {
        this._players = players;
        console.log('here', this._players);
    }

    private _playersMap: Map<any, Player>; // (socketClient, Player)

    // private readonly liesMap: Map<string, string>; // ('mito', 'pseudo')
    // private readonly answersMap: Map<string, string[]>; // (lieValue: 'mito', ['pseudo'])
    // private readonly restartMap: Map<any, string>;
    // private readonly scores: { pseudo: string, scoreValue: number }[]; // [{pseudo: 'pseudo', scoreValue: 500}]

    get playersMap(): Map<any, Player> {
        return this._playersMap;
    }

    initAttributes() {
        this._players = [];
        this._playersMap = new Map();
    }

    addPlayer(pseudo: string, socketClient: any) {
        this._players.push({id: this._players.length, pseudo: pseudo});
        console.log('addPlayer', this._players);
        this.playersMap.set(socketClient, this._players[this._players.length]);
    }

    deletePlayer(deleteId: number, socketClient: any) {
        if (this.players.length > 0) {
            this.players.splice(deleteId, 1);
            this.players.map((player, id) => ({...player, id}));
            this.playersMap.delete(socketClient);
        }
    }
}