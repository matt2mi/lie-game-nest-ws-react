import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Promise } from 'es6-promise';
import { Player } from '../../types';
import Socket = SocketIOClient.Socket;

interface Props {
    readonly pseudo: string;
}

interface State {
    readonly players: Player[];
    readonly goToPlay: boolean;
    readonly nbMaxPlayers: number;
    readonly url: string;
}

export default class SharedWaitingForPlayers extends React.Component<Props, State> {
    socket: Socket;

    constructor(props: Props) {
        super(props);
        this.onUpdatePlayers = this.onUpdatePlayers.bind(this);
        this.enoughPlayers = this.enoughPlayers.bind(this);

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');

        this.state = {
            players: [],
            goToPlay: false,
            nbMaxPlayers: 0,
            url: url.split('/waiting')[0] + '/login'
        };

        this.socket.on('updatePlayers', this.onUpdatePlayers);
        this.socket.on('players-list-full', this.enoughPlayers);
    }

    onUpdatePlayers(players: Player[]): void {
        this.setState({players});
    }

    enoughPlayers(players: Player[]): void {
        this.setState({players, goToPlay: true});
    }

    componentDidMount() {
        const playersPromise = fetch('/api/players')
            .then(result => {
                return result.json();
            });

        const maxPlayersPromise = fetch('/api/nbMaxPlayers')
            .then(result => {
                return result.json();
            });

        Promise.all([playersPromise, maxPlayersPromise])
            .then((results: Player | number[]) => {
                const truePlayers: Player[] = results[0].map((res: Player) => {
                    return {id: res.id, pseudo: res.pseudo};
                });
                this.setState({players: truePlayers, nbMaxPlayers: results[1]});
                if (this.state.nbMaxPlayers === this.state.players.length) {
                    this.setState({goToPlay: true});
                }
            });
    }

    render() {
        if (this.state.goToPlay) {
            return (<Redirect to="/playing"/>);
        } else {
            return (
                <div className="base-div-content">
                    <div className="row justify-content-center">
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header card-header-title">
                                    En attente de joueurs
                                </div>
                                <div className="card-body">
                                    <div className="row justify-content-center">
                                        <label>Connectez vous sur : {this.state.url}</label>
                                    </div>

                                    <div className="row justify-content-center">
                                        {this.state.players.length + '/' + this.state.nbMaxPlayers} joueurs
                                    </div>
                                    <div className="row d-flex justify-content-around">
                                        {this.state.players.map((player: Player, id: number) => {
                                            return (
                                                <div key={id} className="col-sm-5 col-md-3 chips-pseudo">
                                                    {player.pseudo}
                                                </div>
                                            );
                                        })}
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