import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Result, Score } from '../../types';
import TimerProgress from '../reusables/TimerProgress';
import Socket = SocketIOClient.Socket;

interface Props {
    readonly pseudo: string;
    readonly results: Result[];
    readonly scores: Score[];
    readonly nbRounds: number;
}

interface State {
    readonly goNext: boolean;
}

export default class SharedResults extends React.Component<Props, State> {

    wrongAnswer = {
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '0.25rem'
    };
    goodAnswer = {
        backgroundColor: 'green',
        color: 'white',
        borderRadius: '0.25rem'
    };
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.nextQuestion = this.nextQuestion.bind(this);

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.socket.on('nextQuestion', this.nextQuestion);

        this.state = {
            goNext: false
        };
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
                <div className="row justify-content-center">
                    <div className="col-sm-10">

                        <div className="card my-3">
                            <div className="card-header card-header-title">
                                Resultats !
                            </div>
                            <div className="card-body">
                                {this.props.results.map(res => (
                                    <div
                                        className="col mb-1"
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
                                                    ' (' + res.lieValue + ') +200 pour ' +
                                                    (res.liarPseudos.length > 1 ? 'eux' : res.liarPseudos.join(', '))
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div className="card-header card-header-title">
                                Scores{this.props.nbRounds >= 8 ?
                                ' finaux' :
                                ' - question n°' + this.props.nbRounds + ' sur 8'}
                            </div>
                            <div className="card-body">
                                {this.props.scores
                                    .sort((score1: Score, score2: Score) => {
                                        if (score1.value > score2.value) {
                                            return -1;
                                        }
                                        if (score1.value < score2.value) {
                                            return 1;
                                        }
                                        return 0;
                                    })
                                    .map((score, id) => (
                                        <div className="col" key={id}>
                                            {
                                                id === 0 ? '1er - ' : id === 1 ? '2ème - ' : id === 2 ? '3ème - ' : ''
                                            }
                                            {score.pseudo + ': ' + score.value}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {this.props.nbRounds >= 8 ? null : <TimerProgress counterMax={10}/>}
                    </div>
                </div>
            </div>
        );
    }
}