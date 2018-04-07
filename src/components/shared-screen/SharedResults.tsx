import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Result, Score } from '../../types';
import Socket = SocketIOClient.Socket;

interface Props {
    readonly pseudo: string;
    readonly results: Result[];
    readonly scores: Score[];
    readonly nbRounds: number;
}

interface State {
    readonly goNext: boolean;
    readonly decounter: number;
}

export default class SharedResults extends React.Component<Props, State> {

    wrongAnswer = {
        border: '1px solid red'
    };
    goodAnswer = {
        border: '1px solid green'
    };
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.nextQuestion = this.nextQuestion.bind(this);
        this.tick = this.tick.bind(this);

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.socket.on('nextQuestion', this.nextQuestion);

        this.state = {
            goNext: false,
            decounter: 10,
        };
        if (this.props.nbRounds <= 8) {
            this.tick();
        }
    }

    tick() {
        if (this.state.decounter > 0) {
            setTimeout(
                () => {
                    this.setState({decounter: this.state.decounter - 1});
                    this.tick();
                },
                1000);
        }
    }

    nextQuestion() {
        this.setState({goNext: true});
    }

    render() {
        if (this.state.goNext) {
            return (<Redirect to="/playing"/>);
        }
        return (
            <div className="base-div-content">
                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            Resultats !
                        </div>
                        <div className="card-block p-3">
                            {this.props.results.map(res => (
                                <div
                                    className="col m-1"
                                    style={res.liarPseudos[0] === 'truth' ? this.goodAnswer : this.wrongAnswer}
                                    key={res.id}
                                >
                                    {
                                        res.liarPseudos[0] === 'truth' ?
                                            res.playerPseudo + ' a choisi la bonne réponse (' + res.lieValue +
                                            ') +500 !'
                                            :
                                            res.liarPseudos[0] === 'gameLie' ?
                                                res.playerPseudo + ' a choisi notre mito (' + res.lieValue +
                                                ') -400 !'
                                                :
                                                res.playerPseudo + ' a choisi le mito de ' +
                                                res.liarPseudos.join(', ') +
                                                ' (' + res.lieValue + ') +200 pour eux'
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="row">
                        <div className="card">
                            <div className="card-header">
                                Scores{this.props.nbRounds >= 8 ?
                                ' finaux' :
                                ' - question n°' + this.props.nbRounds + ' sur 8'}
                            </div>
                            <div className="card-block p-3">
                                {this.props.scores.map((score, id) => (
                                    <div className="col" key={score.id}>
                                        {id + 1 + ' - ' + score.pseudo + ': ' + score.value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.nbRounds >= 8 ? null :
                        <div className="row">
                            Question suivante dans {this.state.decounter} secondes
                        </div>
                }
            </div>
        );
    }
}