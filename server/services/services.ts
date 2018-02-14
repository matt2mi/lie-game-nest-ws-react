interface Player {
    id: number;
    pseudo: string;
}

export default class Services {
    maxPlayers = 1;
    players: Player[]; // [{id: 0, pseudo: 'pseudo'}]
    playersMap: Map<any, Player>; // (socketClient, Player)
    liesMap: Map<string, string>; // ('mito', 'pseudo')
    answersMap: Map<string, string[]>; // (lieValue: 'mito', ['pseudo'])
    restartMap: Map<any, string>;
    scores: { pseudo: string, scoreValue: number }[]; // [{pseudo: 'pseudo', scoreValue: 500}]

    constructor() {
        this.initAttributes = this.initAttributes.bind(this);
        this.getMaxPlayers = this.getMaxPlayers.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
        this.calculateResults = this.calculateResults.bind(this);
        this.calculateScores = this.calculateScores.bind(this);

        this.initAttributes();
    }

    public static mapToArray(map: Map<any, any>, keyPropName: string, valuePropName: any) {
        const array = [];
        for (let [key, value] of Array.from(map)) {
            array.push({[keyPropName]: key, [valuePropName]: value});
        }
        return array;
    }

    public initAttributes() {
        this.players = [];
        this.playersMap = new Map();
        this.liesMap = new Map();
        this.answersMap = new Map();
        this.restartMap = new Map();
        this.scores = [];
    }

    public getMaxPlayers() {
        return this.maxPlayers;
    }

    public addPlayer(pseudo: string, socketClient: any) {
        this.players.push({id: this.players.length, pseudo: pseudo});
        this.playersMap.set(socketClient, this.players[this.players.length]);
    }

    public deletePlayer(deleteId: number, socketClient: any) {
        if (this.players.length > 0) {
            this.players.splice(deleteId, 1);
            this.players.map((player, id) => {
                player.id = id;
            });
            this.playersMap.delete(socketClient);
        }
    }

    public calculateResults() {
        const results: any[] = [];
        Services.mapToArray(this.answersMap, 'lieValue', 'pseudos')
            .forEach(answer => {
                answer.pseudos.forEach((pseudo: string) => results.push({
                    lieValue: answer.lieValue,
                    liarPseudo: this.liesMap.get(answer.lieValue),
                    playerPseudo: pseudo
                }));
            });
        return results;
    }

    public calculateScores() {
        const scoresMap: Map<string, number> = new Map();
        this.players.forEach(player => scoresMap.set(player.pseudo, 0));

        for (let [lieValue, pseudos] of Array.from(this.answersMap)) {
            const liarPseudo = this.liesMap.get(lieValue);
            if (liarPseudo === 'truth') {
                pseudos.forEach((pseudo: string) => {
                    const score = scoresMap.get(pseudo);
                    if (score) {
                        scoresMap.set(pseudo, score + 500);
                    }
                });
            } else if (liarPseudo === 'gameLie') {
                pseudos.forEach((pseudo: string) => {
                    const score = scoresMap.get(pseudo);
                    if (score) {
                        scoresMap.set(pseudo, score - 400);
                    }
                });
            } else if (liarPseudo) {
                const score = scoresMap.get(liarPseudo);
                if (score) {
                    scoresMap.set(liarPseudo, score + 200 * pseudos.length);
                }
            }
        }

        return Services.mapToArray(scoresMap, 'pseudo', 'value');
    }
}