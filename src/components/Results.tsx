import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

interface Result {
    id: number;
    lieValue: string;
    liarPseudo: string;
    playerPseudo: string;
}

interface Score {
    id: number;
    pseudo: string;
    value: number;
}

interface Props {
}

interface State {
    readonly results: Result[];
    readonly scores: Score[];
    readonly goRestart: boolean;
}

export default class Results extends React.Component<Props, State> {

    wrongAnswer = {
        border: '1px solid red'
    };
    goodAnswer = {
        border: '1px solid green'
    };
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.restart = this.restart.bind(this);
        this.newGame = this.newGame.bind(this);

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.socket.on('newGame', this.newGame);

        this.state = {
            results: [],
            scores: [],
            goRestart: false
        };
    }

    componentWillMount() {
        fetch('/api/results')
            .then(this.handleErrors)
            .then(results => results.json())
            .then((results: Result[]) => {
                console.log('results', results);
                const trueResults: Result[] = results.map((res: Result, id: number): Result => {
                    return {
                        id,
                        playerPseudo: res.playerPseudo,
                        lieValue: res.lieValue,
                        liarPseudo: res.liarPseudo
                    };
                });
                return this.setState({results: trueResults});
            })
            .catch(e => {
                console.error(e);
            });

        fetch('/api/scores')
            .then(this.handleErrors)
            .then(scores => scores.json())
            .then((scores: Score[]) => {
                console.log('scores', scores);
                const trueScores: Score[] = scores.map((score: Score, id: number): Score => {
                    return {
                        id,
                        pseudo: score.pseudo,
                        value: score.value
                    };
                });
                return this.setState({scores: trueScores});
            })
            .catch(e => {
                console.error(e);
            });
    }

    handleErrors(response) {
        // TODO : accessible partout
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    newGame() {
        console.log('restart');
        this.setState({goRestart: true});
    }

    restart() {
        this.socket.emit('restart', 'pseudo'); // TODO STORE
    }

    render() {
        if (this.state.goRestart) {
            return (<Redirect to="/playing"/>);
        }
        return (
            <div className="base-div-content">
                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            Resultats !
                        </div>
                        <div className="card-block p-3 ">

                            {this.state.results.map(res => (
                                <div
                                    className="col m-1"
                                    style={res.liarPseudo === 'truth' ? this.goodAnswer : this.wrongAnswer}
                                    key={res.id}
                                >
                                    {
                                        res.liarPseudo === 'truth' ?
                                            res.playerPseudo + ' a choisi la bonne réponse (' + res.lieValue +
                                            ') +500 !'
                                            :
                                            res.liarPseudo === 'gameLie' ?
                                                res.playerPseudo + ' a choisi notre mito (' + res.lieValue +
                                                ') -400 !'
                                                :
                                                res.playerPseudo + ' a choisi le mito de ' + res.liarPseudo +
                                                ' (' + res.lieValue + ') +200 pour ' + res.liarPseudo
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            Scores !
                        </div>
                        <div className="card-block p-3">
                            <div className="row">
                                {this.state.scores.map(score => (
                                    <div>
                                        <div className="col" key={score.id}>
                                            {score.pseudo}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="row">
                                {this.state.scores.map(score => (
                                    <div>
                                        <div className="col" key={score.id}>
                                            {score.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => this.restart()}>
                    Envoyer
                </button>
            </div>
        );
    }
}