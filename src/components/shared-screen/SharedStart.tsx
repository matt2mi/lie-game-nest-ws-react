import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

interface Props {
}

interface State {
    nbPlayersExpected: number;
    goToWaitingForPlayers: boolean;
}

export default class SharedStart extends React.Component<Props, State> {
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.changeValue = this.changeValue.bind(this);
        this.go = this.go.bind(this);

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');

        this.state = {
            nbPlayersExpected: 2,
            goToWaitingForPlayers: false
        };
    }

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({nbPlayersExpected: parseInt(event.currentTarget.value, 10)});
        event.preventDefault();
    }

    go() {
        this.socket.on('sharedScreenConnected', () => this.setState({goToWaitingForPlayers: true}));
        this.socket.emit('sharedScreenSubscribeToApp', this.state.nbPlayersExpected);
    }

    render() {
        if (this.state.goToWaitingForPlayers) {
            return (<Redirect to="/waitingForPlayers"/>);
        } else {
            return (
                <div className="base-div-content">
                    <div className="row justify-content-center">
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header card-header-title">
                                    Démarrer la partie
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="row justify-content-center">
                                            <div className="form-group">
                                                <label>Combien de joueurs ?</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    onChange={this.changeValue}
                                                    min={2}
                                                    max={8}
                                                    value={this.state.nbPlayersExpected}
                                                />
                                            </div>
                                        </div>
                                    </form>

                                    <div className="row justify-content-center">
                                        <button className="btn btn-success" onClick={this.go}>Go !</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}