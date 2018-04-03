import * as React from 'react';
import { SyntheticEvent } from 'react';
import * as io from 'socket.io-client';
import { Redirect } from 'react-router';
import Socket = SocketIOClient.Socket;

interface Props {
    pseudo: string;
    setPseudo: (pseudo: string) => void;
}

interface State {
    readonly pseudo: string;
    readonly errorMsg: string;
    readonly connected: boolean;
    readonly disableLoginBtn: boolean;
}

export default class Login extends React.Component<Props, State> {
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.state = {
            pseudo: '',
            errorMsg: null,
            connected: false,
            disableLoginBtn: false
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');

        this.login = this.login.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.subscribeToApp = this.subscribeToApp.bind(this);
    }

    subscribeToApp(cb: (err: string) => void, pseudo: string): void {
        this.socket.on('updatePlayers', (players, errorMsg) => {
            if (errorMsg) {
                this.setState({errorMsg, disableLoginBtn: true});
            } else if (!this.state.connected) {
                cb('');
            }
        });
        this.socket.emit('subscribeToApp', pseudo);
    }

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            errorMsg: null,
            disableLoginBtn: false,
            pseudo: event.currentTarget.value
        });
        event.preventDefault();
    }

    login(event: SyntheticEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (this.state.pseudo === '') {
            this.setState({errorMsg: 'need valid pseudo', disableLoginBtn: true});
        } else {
            this.subscribeToApp(
                (errorMsg: string) => {
                    if (errorMsg.length > 0) {
                        console.error(errorMsg);
                        this.setState({errorMsg, disableLoginBtn: true});
                    } else {
                        this.props.setPseudo(this.state.pseudo);
                        this.setState({connected: true});
                    }
                },
                this.state.pseudo
            );
        }
    }

    render() {
        if (this.state.connected) {
            return (<Redirect to="/waiting"/>);
        }
        return (
            <div className="base-div-content">
                <div className="row mt-3 justify-content-center">
                    <div className="card">
                        <div className="card-header">
                            Login
                        </div>
                        <div className="card-block p-3">
                            <form>
                                <div className="row">
                                    <div className="form-group">
                                        <label>Pseudo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={this.changeValue}
                                            required={true}
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <button
                                        className="btn btn-success"
                                        onClick={this.login}
                                        disabled={this.state.disableLoginBtn}
                                    >
                                        Login
                                    </button>
                                </div>
                                <div className="row justify-content-center pt-2">
                                    {this.state.errorMsg ? <div className="error">{this.state.errorMsg}</div> : null}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}