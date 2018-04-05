import * as React from 'react';
import * as io from 'socket.io-client';
import { Redirect } from 'react-router';
import Socket = SocketIOClient.Socket;

interface Props {
}

interface State {
    onEndWaiting: boolean;
}

export default class PlayerWaiting extends React.Component<Props, State> {
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.state = {
            onEndWaiting: false
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.socket.on('onEndWaiting', () => this.setState({onEndWaiting: true}));
    }

    render() {
        if (this.state.onEndWaiting) {
            return (<Redirect to="/playing"/>);
        }
        return (
            <div className="base-div-content">
                <div className="row mt-3 justify-content-center">
                    <div className="card">
                        <div className="card-header">
                            Waiting...
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}