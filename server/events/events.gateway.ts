import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import { PlayersService } from '../players/players.service';
import { QuestionsService } from '../questions/questions.service';
import { Answer, Player } from '../types';

@WebSocketGateway({port: 3001})
export class EventsGateway {
    @WebSocketServer() webSocketServer;
    nbAnswers = 0;
    nbRounds = 1;

    constructor(private readonly playersService: PlayersService,
                private readonly questionsService: QuestionsService) {
    }

    @SubscribeMessage('disconnect')
    disconnect(socketClient): void {
        const pseudo = this.playersService.getPseudoFromPlayersMap(socketClient);
        if (pseudo) {
            console.log('disconnect', pseudo);
            this.playersService.deletePlayer(socketClient, pseudo);
            this.webSocketServer.emit('updatePlayers', this.playersService.players);
        }
    }

    @SubscribeMessage('subscribeToApp')
    onSubscribe(socketClient, pseudo): void {
        if (this.playersService.players.length < this.playersService.maxPlayers) {
            if (this.playersService.players.some((player: Player) => pseudo === player.pseudo)) {
                const errorMsg = 'Pseudo déjà pris :/';
                console.log(errorMsg);
                this.webSocketServer.emit('updatePlayers', this.playersService.players, errorMsg);
            } else {
                this.playersService.addPlayer(socketClient, pseudo);
                console.log(this.playersService.getPseudoFromPlayersMap(socketClient), 'connected');
                this.webSocketServer.emit('updatePlayers', this.playersService.players);

                if (this.playersService.players.length === this.playersService.maxPlayers) {
                    this.webSocketServer.emit('players-list-full', this.playersService.players);
                }
            }
        }
    }

    @SubscribeMessage('lieAnswered')
    lieAnswered(socketClient, {lieValue, pseudo}): void {
        this.playersService.setInLiesMap(socketClient, lieValue, pseudo);
        console.log('lie received', lieValue, 'from', pseudo);
        if (this.playersService.getLiesMapSize() === this.playersService.players.length) {
            this.playersService.setInLiesMap(socketClient, this.questionsService.getAnswers()[0], 'truth');
            this.playersService.setInLiesMap(socketClient, this.questionsService.getLies()[0], 'gameLie');
            console.log('all lies sent');
            this.webSocketServer.emit(
                'loadLies',
                // TODO pas marché
                PlayersService.mapToArray(
                    this.playersService.getLiesMap(),
                    'lieValue',
                    'pseudo')
            );
        }
    }

    @SubscribeMessage('lieChoosen')
    lieChoosen(socketClient, answer: Answer): void {
        console.log('lie choosen by', answer.pseudo, ':', answer.lie.value, '(', answer.lie.pseudo, ')');
        if (this.playersService.getAnswersMap().get(answer.lie.value) !== undefined) {
            this.playersService.addPseudoInAnswersMap(answer.lie.value, answer.pseudo);
        } else {
            this.playersService.setInAnswersMap(answer.lie.value, [answer.pseudo]);
        }
        this.nbAnswers++;
        if (this.nbAnswers === this.playersService.players.length) {
            this.webSocketServer.emit('goToResults', {
                results: this.playersService.calculateResults(), // TODO champ liarPseudos => gestion front
                scores: this.playersService.calculateScores(),
                nbRounds: this.nbRounds
            });
            this.playersService.endOfRound();
            this.questionsService.endOfRound();
            this.questionsService.nextQuestion();
            this.nbAnswers = 0;
            if (this.nbRounds <= 7) {
                setTimeout(() => {
                    this.webSocketServer.emit('nextQuestion');
                    this.nbRounds++;
                }, 10000);
            }
        }
    }
}