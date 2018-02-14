import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import { PlayersService } from '../services/players.service';

@WebSocketGateway({port: 3001})
export class EventsGateway {
    @WebSocketServer() webSocketServer;

    constructor(private readonly playersService: PlayersService) {
    }

    @SubscribeMessage('disconnect')
    disconnect(socketClient): void { // WsResponse<Player[]> {
        if (this.playersService.playersMap.size > 0 &&
            this.playersService.playersMap.get(socketClient) &&
            this.playersService.playersMap.get(socketClient).id !== -1) {

            console.log('disconnect');
            this.playersService.deletePlayer(this.playersService.playersMap.get(socketClient).id, socketClient);
            this.webSocketServer.emit('updatePlayers', this.playersService.players);
            // return {
            //     event: 'updatePlayers',
            //     data: this.playersService.players
            // };
        }
    }

    @SubscribeMessage('subscribeToApp')
    onSubscribe(socketClient, pseudo): void {
        if (this.playersService.players.length < this.playersService.maxPlayers) {
            console.log('subscribeToApp', pseudo);
            this.playersService.addPlayer(pseudo, socketClient);
            console.log('updatePlayers', this.playersService.players);
            this.webSocketServer.emit('updatePlayers', this.playersService.players);
            // return {
            //     event: 'updatePlayers',
            //     data: this.playersService.players
            // };

            if (this.playersService.players.length === this.playersService.maxPlayers) {
                this.webSocketServer.emit('players-list-full', this.playersService.players);
            }
        }
    }
}