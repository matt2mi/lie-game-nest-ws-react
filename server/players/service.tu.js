const expect = require('chai').expect;

const service = require('./service');

describe('Service Test', () => {
    describe('Fct addPlayer', () => {
        it('addPlayer should be a fct', () => {
            expect(service.addPlayer).to.be.a('function');
        });

        /*it('addPlayer should add one player to players & playersMap', () => {
            // given
            const player = 'player4';
            const players = [
                {id: 0, pseudo: 'player1'},
                {id: 1, pseudo: 'player2'},
                {id: 2, pseudo: 'player3'}
            ];
            const playersMap = new Map();

            playersMap
                .set({socketName: 'socket1'}, 'player1')
                .set({socketName: 'socket2'}, 'player2')
                .set({socketName: 'socket3'}, 'player3');

            // when
            service.addPlayer(players, playersMap, player, {socketName: 'socket4'});

            // then
            expect(service.players.length).to.equal(4);
            expect(service.playersMap.size).to.equal(4);
            // expect(service.).to.equal();
        });*/
    });

    describe('Fct deletePlayer', () => {
        it('deletePlayer should be a fct', () => {
            expect(service.deletePlayer).to.be.a('function');
        });

        /*it('deletePlayer should delete the only one player', () => {
            // given
            const pseudo = 'player1';
            service.players.push(pseudo);
            const socketClient = {value: 'socketClient'};
            service.playersMap.set(socketClient, pseudo);

            // when
            service.deletePlayer(0, socketClient);

            // then
            expect(service.players.length).to.equal(0);
            expect(service.playersMap.size).to.equal(0);
        });

        it('deletePlayer should delete one player in 3 players & set back the ids', () => {
            // given
            const player1 = {id: 0, pseudo: 'player1'};
            const player2 = {id: 1, pseudo: 'player2'};
            const player3 = {id: 2, pseudo: 'player3'};
            service.players.push(player1);
            service.players.push(player2);
            service.players.push(player3);

            const socketClient1 = {value: 'socketClient1'};
            const socketClient2 = {value: 'socketClient2'};
            const socketClient3 = {value: 'socketClient3'};
            service.playersMap.set(socketClient1, player1);
            service.playersMap.set(socketClient2, player2);
            service.playersMap.set(socketClient3, player3);

            // when
            service.deletePlayer(1, socketClient2);

            // then
            expect(service.players.length).to.equal(2);

            expect(service.players[0].id).to.equal(player1.id);
            expect(service.players[0].pseudo).to.equal(player1.pseudo);
            expect(service.players[1].id).to.equal(player2.id);
            expect(service.players[1].pseudo).to.equal(player3.pseudo);

            expect(service.playersMap.size).to.equal(2);
        });*/
    });

    describe('Fct calculateResults', () => {
        it('calculateResults should be a fct', () => {
            expect(service.calculateResults).to.be.a('function');
        });

        it('calculateResults should have 1 line by player with the answer choosen - 3pl - 3 wrong answers', () => {
            // given
            const answersMap = new Map();
            const liesMap = new Map();

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3');

            answersMap
                .set('mito2', ['player1'])
                .set('mito3', ['player2'])
                .set('mito1', ['player3']);

            // when
            const resutls = service.calculateResults(answersMap, liesMap);

            // then
            expect(resutls[0].playerPseudo).to.equal('player1');
            expect(resutls[0].liarPseudo).to.equal('player2');
            expect(resutls[0].lieValue).to.equal('mito2');

            expect(resutls[1].playerPseudo).to.equal('player2');
            expect(resutls[1].liarPseudo).to.equal('player3');
            expect(resutls[1].lieValue).to.equal('mito3');

            expect(resutls[2].playerPseudo).to.equal('player3');
            expect(resutls[2].liarPseudo).to.equal('player1');
            expect(resutls[2].lieValue).to.equal('mito1');
        });

        it('calculateResults should have 1 line by player with the answer choosen - 3pl - 1 good answer & 1 game lie', () => {
            // given
            const answersMap = new Map();
            const liesMap = new Map();

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3')
                .set('truth', 'truth')
                .set('mito4', 'gameLie');

            answersMap
                .set('truth', ['player1'])
                .set('mito3', ['player2'])
                .set('mito4', ['player3']);

            // when
            const resutls = service.calculateResults(answersMap, liesMap);

            // then
            expect(resutls[0].playerPseudo).to.equal('player1');
            expect(resutls[0].liarPseudo).to.equal('truth');
            expect(resutls[0].lieValue).to.equal('truth');

            expect(resutls[1].playerPseudo).to.equal('player2');
            expect(resutls[1].liarPseudo).to.equal('player3');
            expect(resutls[1].lieValue).to.equal('mito3');

            expect(resutls[2].playerPseudo).to.equal('player3');
            expect(resutls[2].liarPseudo).to.equal('gameLie');
            expect(resutls[2].lieValue).to.equal('mito4');
        });
    });

    describe('Fct calculateScores', () => {
        it('calculateScores should be a fct', () => {
            expect(service.calculateScores).to.be.a('function');
        });

        it('calculateScores should give 200 by lie choosen - 1pl', () => {
            // given
            const players = [{id: 0, pseudo: 'player1'}];
            const liesMap = new Map();
            const answersMap = new Map();

            liesMap.set('mito1', 'player1');

            answersMap.set('mito1', ['player1']);

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            console.log('scores', scores);
            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(200);
        });

        it('calculateScores should give 200 by lie choosen - 3pl - 2 player on same lie', () => {
            // given
            const players = [
                {id: 0, pseudo: 'player1'},
                {id: 1, pseudo: 'player2'},
                {id: 2, pseudo: 'player3'}
            ];
            const answersMap = new Map();
            const liesMap = new Map();

            answersMap
                .set('mito1', ['player1', 'player2'])
                .set('mito2', ['player3']);

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3');

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(400);
            expect(scores[1].pseudo).to.equal('player2');
            expect(scores[1].value).to.equal(200);
        });

        it('calculateScores should give 200 by lie choosen - 3pl - 3 pl on game lie', () => {
            // given
            const players = [
                {id: 0, pseudo: 'player1'},
                {id: 1, pseudo: 'player2'},
                {id: 2, pseudo: 'player3'}
            ];
            const answersMap = new Map();
            const liesMap = new Map();

            answersMap
                .set('mito4', ['player1', 'player2', 'player3']);

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3')
                .set('truth', 'truth')
                .set('mito4', 'gameLie');

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(-400);
            expect(scores[1].pseudo).to.equal('player2');
            expect(scores[1].value).to.equal(-400);
            expect(scores[2].pseudo).to.equal('player3');
            expect(scores[2].value).to.equal(-400);
        });

        it('calculateScores should give 200 by lie choosen - 3pl - 3 pl on good answer', () => {
            // given
            const players = [
                {id: 0, pseudo: 'player1'},
                {id: 1, pseudo: 'player2'},
                {id: 2, pseudo: 'player3'}
            ];
            const liesMap = new Map();
            const answersMap = new Map();

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3')
                .set('truth', 'truth')
                .set('mito4', 'gameLie');

            answersMap
                .set('truth', ['player1', 'player2', 'player3']);

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(500);
            expect(scores[1].pseudo).to.equal('player2');
            expect(scores[1].value).to.equal(500);
            expect(scores[2].pseudo).to.equal('player3');
            expect(scores[2].value).to.equal(500);
        });

        it('calculateScores should give 200 by lie choosen - 3pl - pl1 on good answer & pl2 & pl3 on pl1 lie', () => {
            // given
            const players = [
                {id: 0, pseudo: 'player1'},
                {id: 1, pseudo: 'player2'},
                {id: 2, pseudo: 'player3'}
            ];
            const liesMap = new Map();
            const answersMap = new Map();

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3')
                .set('truth', 'truth')
                .set('mito4', 'gameLie');

            answersMap
                .set('truth', ['player1'])
                .set('mito1', ['player2', 'player3']);

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(900);
            expect(scores[1].pseudo).to.equal('player2');
            expect(scores[1].value).to.equal(0);
            expect(scores[2].pseudo).to.equal('player3');
            expect(scores[2].value).to.equal(0);
        });

        it('calculateScores should ...', () => {
            // given
            const players = [
                {id: 0, pseudo: 'player1'},
                {id: 1, pseudo: 'player2'},
                {id: 2, pseudo: 'player3'}
            ];
            const liesMap = new Map();
            const answersMap = new Map();

            liesMap
                .set('mito1', 'player1')
                .set('mito2', 'player2')
                .set('mito3', 'player3')
                .set('truth', 'truth')
                .set('mito4', 'gameLie');

            answersMap
                .set('truth', ['player1'])
                .set('mito4', ['player2'])
                .set('mito1', ['player3']);

            // when
            const scores = service.calculateScores(players, answersMap, liesMap);

            // then
            expect(scores[0].pseudo).to.equal('player1');
            expect(scores[0].value).to.equal(700);
            expect(scores[1].pseudo).to.equal('player2');
            expect(scores[1].value).to.equal(-400);
            expect(scores[2].pseudo).to.equal('player3');
            expect(scores[2].value).to.equal(0);
        });
    });
});