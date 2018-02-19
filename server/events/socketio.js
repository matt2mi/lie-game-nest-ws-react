const sio = require('socket.io');
const Service = require('../services/service');
const QUESTIONS = require('../questions/questions.service');

let nbAnswers = 0;

module.exports = function (httpServer) {

    // TODO : plus vite - sio(httpServer, { transports: [ 'websocket' ] }) ??
    let sioServer = sio(httpServer);

    sioServer.on('connection', (socketClient) => {
        socketClient.on('disconnect', () => {
            if (Service.playersMap.size > 0 &&
                Service.playersMap.get(socketClient) &&
                Service.playersMap.get(socketClient).id !== -1) {
                Service.deletePlayer(Service.playersMap.get(socketClient).id, socketClient);
                sioServer.emit('updatePlayers', Service.players);
            }
        });

        socketClient.on('subscribeToApp', (pseudo) => {
            if (Service.players.length < Service.getMaxPlayers()) {
                Service.addPlayer(pseudo, socketClient);
                sioServer.emit('updatePlayers', Service.players);

                if (Service.players.length === Service.maxPlayers) {
                    sioServer.emit('players-list-full', Service.players);
                }
            }
        });

        socketClient.on('lieAnswered', ({lieValue, pseudo}) => {
            Service.liesMap.set(lieValue, pseudo);
            console.log('lie received', lieValue, 'from', pseudo);
            console.log(Service.liesMap.size, '===', Service.players.length);
            if (Service.liesMap.size === Service.players.length) {
                Service.liesMap
                    .set(QUESTIONS[0].answers[0], 'truth')
                    .set(QUESTIONS[0].lies[0], 'gameLie');
                sioServer.emit('loadLies', Service.mapToArray(Service.liesMap, 'lieValue', 'pseudo'));
            }
        });

        socketClient.on('lieChoosen', answer => {
            console.log('lie choosen by', answer.pseudo, ':', answer.lie.lieValue, '(', answer.lie.pseudo, ')');

            if (Service.answersMap.get(answer.lie.lieValue) !== undefined) {
                Service.answersMap.get(answer.lie.lieValue).push(answer.pseudo);
            } else {
                Service.answersMap.set(answer.lie.lieValue, [answer.pseudo]);
            }

            nbAnswers++;
            if (nbAnswers === Service.players.length) {
                sioServer.emit('goToResults');
            }
        });

        socketClient.on('restart', pseudo => {
            Service.restartMap.set(socketClient, pseudo);
            console.log(pseudo, 'wants to restart !');
            if (Service.restartMap.size === Service.maxPlayers) {
                Service.restartGame();
                sioServer.emit('newGame');
            }
        });
    });
};