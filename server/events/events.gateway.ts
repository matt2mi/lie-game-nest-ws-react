import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import { PlayersService } from '../players/players.service';

@WebSocketGateway({port: 3001})
export class EventsGateway {
    @WebSocketServer() webSocketServer;

    constructor(private readonly playersService: PlayersService) {
    }

    playersMap = new Map();

    @SubscribeMessage('disconnect')
    disconnect(socketClient): void {
        const pseudo = this.playersMap.get(socketClient);
        if (pseudo) {
            console.log(pseudo, 'disconnected');
            this.playersMap.set(socketClient, pseudo);
            this.playersService.deletePlayer(pseudo);
            this.webSocketServer.emit('updatePlayers', this.playersService.players);
        }
    }

    @SubscribeMessage('subscribeToApp')
    onSubscribe(socketClient, pseudo): void {
        if (this.playersService.players.length < this.playersService.maxPlayers) {
            console.log(pseudo, 'connected');
            this.playersService.addPlayer(pseudo);
            this.playersMap.set(socketClient, pseudo);
            this.webSocketServer.emit('updatePlayers', this.playersService.players);

            if (this.playersService.players.length === this.playersService.maxPlayers) {
                this.webSocketServer.emit('players-list-full', this.playersService.players);
            }
        }
    }
}