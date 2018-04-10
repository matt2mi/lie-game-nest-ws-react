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
    readonly startPlaying: boolean;
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
            startPlaying: false,
            disableLoginBtn: false
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');

        this.socket.on('isConnected', (errorMsg: string) => {
            if (errorMsg) {
                this.setState({errorMsg, disableLoginBtn: true});
            } else {
                this.props.setPseudo(this.state.pseudo);
                this.setState({connected: true});
            }
        });
        this.socket.on('players-list-full', () => {
            console.log('players-list-full');
            this.setState({startPlaying: true, connected: false});
        });

        this.login = this.login.bind(this);
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            errorMsg: null,
            disableLoginBtn: false,
            pseudo: event.currentTarget.value.split(' ').join('')
        });
        event.preventDefault();
    }

    login(event: SyntheticEvent<HTMLButtonElement>) {
        if (this.state.pseudo === '') {
            this.setState({errorMsg: 'need valid pseudo', disableLoginBtn: true});
        } else {
            this.socket.emit('subscribeToApp', this.state.pseudo);
        }
        event.preventDefault();
    }

    render() {
        if (this.state.connected) {
            return (
                <div className="base-div-content">
                    <h1>Waiting...</h1>
                </div>
            );
        } else if (this.state.startPlaying) {
            return (<Redirect to="/playerLying"/>);
        } else {
            return (
                <div className="base-div-content">
                    <div className="row justify-content-center">
                        <div className="col-sm-10 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-header card-header-title">
                                    Login
                                </div>
                                <div className="card-body p-3">
                                    <form>
                                        <div className="row justify-content-center">
                                            <div className="form-group">
                                                <label>Pseudo</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={this.changeValue}
                                                    required={true}
                                                    value={this.state.pseudo}
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
                                            {this.state.errorMsg ?
                                                <div className="error">{this.state.errorMsg}</div> : null}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}