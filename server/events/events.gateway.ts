import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import { PlayersService } from '../players/players.service';

@WebSocketGateway({port: 3001})
export class EventsGateway {
    @WebSocketServer() webSocketServer;

    constructor(private readonly playersService: PlayersService) {
    }

    @SubscribeMessage('disconnect')
    disconnect(socketClient): void {
        const pseudo = this.playersService.playersMap.get(socketClient);
        if (pseudo) {
            console.log('disconnect', pseudo);
            this.playersService.deletePlayer(socketClient, pseudo);
            this.webSocketServer.emit('updatePlayers', this.playersService.players);
        }
    }

    @SubscribeMessage('subscribeToApp')
    onSubscribe(socketClient, pseudo): void {
        if (this.playersService.players.length < this.playersService.maxPlayers) {
            this.playersService.addPlayer(socketClient, pseudo);
            console.log(this.playersService.playersMap.get(socketClient), 'connected');
            this.webSocketServer.emit('updatePlayers', this.playersService.players);

            if (this.playersService.players.length === this.playersService.maxPlayers) {
                this.webSocketServer.emit('players-list-full', this.playersService.players);
            }
        }
    }
}