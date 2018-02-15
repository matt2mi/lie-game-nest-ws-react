import { Component } from '@nestjs/common';

export interface Player {
    id: number;
    pseudo: string;
}

@Component()
export class PlayersService {
    public playersMap: Map<any, string> = new Map(); // set(socket, pseudo)
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

    private readonly _maxPlayers = 2;

    // private readonly liesMap: Map<string, string>; // ('mito', 'pseudo')
    // private readonly answersMap: Map<string, string[]>; // (lieValue: 'mito', ['pseudo'])
    // private readonly restartMap: Map<any, string>;
    // private readonly scores: { pseudo: string, scoreValue: number }[]; // [{pseudo: 'pseudo', scoreValue: 500}]

    constructor() {
        this.initAttributes();
    }

    // public static mapToArray(map: Map<any, any>, keyPropName: string, valuePropName: any) {
    //     const array = [];
    //     for (let [key, value] of Array.from(map)) {
    //         array.push({[keyPropName]: key, [valuePropName]: value});
    //     }
    //     return array;
    // }

    initAttributes() {
        this._players = [];
    }

    addPlayer(socketClient: any, pseudo: string) {
        this._players.push({id: this._players.length, pseudo: pseudo});
        this.playersMap.set(socketClient, pseudo);
    }

    deletePlayer(socketClient: any, pseudo: string) {
        if (this._players.length > 0) {
            const id = this.players.findIndex(player => player.pseudo === pseudo);
            this._players.splice(id, 1);
            this.playersMap.delete(socketClient);
            this._players.map((player, id) => ({...player, id}));
        }
    }

    // calculateResults() {
    //     const results: any[] = [];
    //     Services.mapToArray(this.answersMap, 'lieValue', 'pseudos')
    //         .forEach(answer => {
    //             answer.pseudos.forEach((pseudo: string) => results.push({
    //                 lieValue: answer.lieValue,
    //                 liarPseudo: this.liesMap.get(answer.lieValue),
    //                 playerPseudo: pseudo
    //             }));
    //         });
    //     return results;
    // }
    //
    // calculateScores() {
    //     const scoresMap: Map<string, number> = new Map();
    //     this.players.forEach(player => scoresMap.set(player.pseudo, 0));
    //
    //     for (let [lieValue, pseudos] of Array.from(this.answersMap)) {
    //         const liarPseudo = this.liesMap.get(lieValue);
    //         if (liarPseudo === 'truth') {
    //             pseudos.forEach((pseudo: string) => {
    //                 const score = scoresMap.get(pseudo);
    //                 if (score) {
    //                     scoresMap.set(pseudo, score + 500);
    //                 }
    //             });
    //         } else if (liarPseudo === 'gameLie') {
    //             pseudos.forEach((pseudo: string) => {
    //                 const score = scoresMap.get(pseudo);
    //                 if (score) {
    //                     scoresMap.set(pseudo, score - 400);
    //                 }
    //             });
    //         } else if (liarPseudo) {
    //             const score = scoresMap.get(liarPseudo);
    //             if (score) {
    //                 scoresMap.set(liarPseudo, score + 200 * pseudos.length);
    //             }
    //         }
    //     }
    //
    //     return PlayersService.mapToArray(scoresMap, 'pseudo', 'value');
    // }
}