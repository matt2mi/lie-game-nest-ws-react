import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Promise } from 'es6-promise';
import Socket = SocketIOClient.Socket;

interface Player {
    id: number;
    pseudo: string;
}

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
                    <div className="row">En attente de joueurs => {this.state.url}</div>
                    <div className="row">
                        {this.state.players.length + '/' + this.state.nbMaxPlayers} joueurs
                    </div>
                    {this.state.players.map((player: Player, id: number) => {
                        return (<div className="row" key={player.id}>{id + 1 + ' - ' + player.pseudo}</div>);
                    })}
                </div>
            );
        }
    }
}