import {
    WebSocketGateway,
    SubscribeMessage,
    WsResponse,
    WebSocketServer
} from '@nestjs/websockets';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

@WebSocketGateway({ port: 3002 })
export class EventsGateway {
    @WebSocketServer() server;

    @SubscribeMessage('subscribeToApp')
    onSubscribe(client, data): WsResponse<string> {
        console.log(data, 'connected !!');
        return {
            event: 'connected',
            data: 'coucou ' + data + ' !!'
        };
    }

    @SubscribeMessage('yop')
    onYop(client, data) {
        console.log(data, 'yopped !');
    }
}