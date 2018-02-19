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
    readonly connected: boolean;
    readonly goNext: boolean;
}

export default class Login extends React.Component<Props, State> {
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.state = {
            pseudo: '',
            connected: false,
            goNext: false
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');

        this.login = this.login.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.subscribeToApp = this.subscribeToApp.bind(this);
    }

    subscribeToApp(cb: (err: string) => void, pseudo: string): void {
        this.socket.on('updatePlayers', () => cb(''));
        this.socket.emit('subscribeToApp', pseudo);
    }

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            pseudo: event.currentTarget.value
        });
    }

    login(event: SyntheticEvent<HTMLButtonElement>) {
        console.log('pseudo', this.state.pseudo);
        event.preventDefault();
        this.subscribeToApp(
            (error: string) => {
                console.log('updatePlayers - login');
                if (error.length > 0) {
                    console.error(error);
                } else {
                    this.props.setPseudo(this.state.pseudo);
                    this.setState({goNext: true});
                }
            },
            this.state.pseudo
        );
    }

    render() {
        if (this.state.goNext) {
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
                                <div className="form-group">
                                    <label>Pseudo</label>
                                    <input type="text" className="form-control" onChange={this.changeValue}/>
                                </div>
                                <button onClick={this.login}>
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}