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
}

interface State {
    readonly players: Player[];
    readonly goToPlay: boolean;
    readonly nbMaxPlayers: number;
}

class WaitingPlayers extends React.Component<Props, State> {
    socket: Socket;

    constructor(props: Props) {
        super(props);
        this.onUpdatePlayers = this.onUpdatePlayers.bind(this);
        this.enoughPlayers = this.enoughPlayers.bind(this);

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.state = {players: [], goToPlay: false, nbMaxPlayers: 0};
        this.socket.on('updatePlayers', this.onUpdatePlayers);
        this.socket.on('players-list-full', this.enoughPlayers);
    }

    onUpdatePlayers(players: Player[]): void {
        this.setState({players});
    }

    enoughPlayers(players: Player[]): void {
        console.log('players', players);
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
            .then((results: any[]) => {
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
                    <div className="row">Waiting other players...</div>
                    <div className="row">
                        {this.state.players.length + '/' + this.state.nbMaxPlayers} players
                    </div>
                    {this.state.players.map(player => {
                        return (<div className="row" key={player.id}>{player.pseudo}</div>);
                    })}
                </div>
            );
        }
    }
}

export default WaitingPlayers;