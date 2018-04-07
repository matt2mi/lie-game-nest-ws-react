/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
import { Component } from '@nestjs/common';
import { Player } from '../types';

@Component()
export class PlayersService {
    private _maxPlayers: number = 2;
    get maxPlayers(): number {
        return this._maxPlayers;
    }

    setMaxPlayers(maxPls: number) {
        this._maxPlayers = maxPls;
    }

    private _players: Player[];
    get players(): Player[] {
        return this._players;
    }
    set players(players: Player[]) {
        this._players = players;
    }

    private _playersUnanswered: string[];

    // TODO TS getter => getMap(truc) return map.get(truc)
    // set(socket, pseudo)
    private playersMap: Map<any, string> = new Map<any, string>();
    // lieValue, ['pseudo1', 'pseudo2']
    private liesMap: Map<string, string[]> = new Map();
    // (lieValue: 'mito', ['pseudo'])
    private answersMap: Map<string, string[]> = new Map();
    // pseudo, score
    private scoresMap: Map<string, number> = new Map();

    constructor() {
        this.initAttributes();
    }

    public static mapToArray(map: Map<any, any>, keyPropName: string, valuePropName: any) {
        const array = [];
        for (let [key, value] of Array.from(map)) {
            array.push({[keyPropName]: key, [valuePropName]: value});
        }
        return array;
    }

    initAttributes() {
        this._players = [];
    }

    getPseudoFromPlayersMap(socketClient: any): string {
        return this.playersMap.get(socketClient);
    }

    setPseudoInLiesMap(lieValue: string, pseudo: string): void {
        if (this.liesMap.get(lieValue)) {
            this.liesMap.set(lieValue, [...this.liesMap.get(lieValue), pseudo]);
        } else {
            this.liesMap.set(lieValue, [pseudo]);
        }
    }

    getLiesMap(): Map<string, string[]> {
        return this.liesMap;
    }

    getLiesMapSize(): number {
        return this.liesMap.size;
    }

    getLiarPseudosFromLieValue(lieValue: string): string[] {
        return this.liesMap.get(lieValue);
    }

    setPseudoInAnswersMap(lieValue: string, pseudo: string) {
        if (this.answersMap.get(lieValue)) {
            this.answersMap.get(lieValue).push(pseudo);
        } else {
            this.answersMap.set(lieValue, [pseudo]);
        }
    }

    getLastPlayersUnanswer(pseudo: string): number {
        const id = this._playersUnanswered.findIndex(pl => pl === pseudo);
        this._playersUnanswered.splice(id, 1);
        return this._players.length - this._playersUnanswered.length;
    }

    initPlayersUnanswered() {
        this._playersUnanswered = this._players.map(player => player.pseudo);
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

    calculateResults() {
        const results: any[] = [];
        PlayersService.mapToArray(this.answersMap, 'lieValue', 'pseudos')
            .forEach(answer => {
                answer.pseudos.forEach((pseudo: string) => results.push({
                    lieValue: answer.lieValue,
                    liarPseudos: this.getLiarPseudosFromLieValue(answer.lieValue),
                    playerPseudo: pseudo
                }));
            });
        return results;
    }

    calculateScores() {
        if (this.scoresMap.size < 1) this.players.forEach(player => this.scoresMap.set(player.pseudo, 0));

        for (let [lieValue, pseudos] of Array.from(this.answersMap)) {
            const liarPseudos = this.getLiarPseudosFromLieValue(lieValue);
            liarPseudos.forEach(liarPseudo => {
                if (liarPseudo === 'truth') {
                    pseudos.forEach((pseudo: string) => {
                        const score = this.scoresMap.get(pseudo);
                        if (score !== undefined) {
                            this.scoresMap.set(pseudo, score + 500);
                        }
                    });
                } else if (liarPseudo === 'gameLie') {
                    pseudos.forEach((pseudo: string) => {
                        const score = this.scoresMap.get(pseudo);
                        if (score !== undefined) {
                            this.scoresMap.set(pseudo, score - 400);
                        }
                    });
                } else if (liarPseudo) {
                    const score = this.scoresMap.get(liarPseudo);
                    if (score !== undefined) {
                        this.scoresMap.set(liarPseudo, score + 200 * pseudos.length);
                    }
                }
            });
        }

        return PlayersService.mapToArray(this.scoresMap, 'pseudo', 'value');
    }

    endOfRound() {
        this.playersMap = new Map();
        this.liesMap = new Map();
        this.answersMap = new Map();
        this.initPlayersUnanswered();
    }
}