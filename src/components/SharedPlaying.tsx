import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Question, Result, Score } from '../types';
import { Player } from '../../server/types';
import Socket = SocketIOClient.Socket;

interface Props {
    setResultsAndScores: (results: ReadonlyArray<Result>, scores: ReadonlyArray<Score>) => void;
    setNbRounds: (nbRounds: number) => void;
}

interface State {
    readonly question: Question;
    readonly goToResults: boolean;
    readonly unAnsweredPlayers: string[];
}

export default class SharedPlaying extends React.Component<Props, State> {

    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.state = {
            question: {text: '', answers: [], lies: []},
            goToResults: false,
            unAnsweredPlayers: []
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.socket.on(
            'unansweredPlayers',
            (unAnsweredPlayers: string[]) => {
                this.setState({unAnsweredPlayers});
            });
    }

    componentWillMount() {
        fetch('/api/question')
            .then(result => result.json())
            .then((question: Question) => {
                const trueQuestion: Question = {text: question.text, answers: question.answers, lies: question.lies};
                this.setState({question: trueQuestion});
            })
            .catch(e => {
                console.error(e);
            });
        fetch('/api/players')
            .then(result => {
                return result.json();
            })
            .then((players: Player[]) => this.setState(
                {unAnsweredPlayers: players.map(player => player.pseudo)}
            ))
            .catch(e => {
                console.error(e);
            });
    }

    render() {
        if (this.state.goToResults) {
            return (<Redirect to="/results"/>);
        }
        return (
            <div className="base-div-content">
                <div className="card">
                    <div className="row">
                        <div className="col-12">
                            <h1>{this.state.question.text}</h1>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-12">On attend qui ...</div>
                        <div className="col-12">
                            {
                                this.state.unAnsweredPlayers.map(player => (
                                    <div className="col-3">
                                        {player}
                                    </div>)
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}