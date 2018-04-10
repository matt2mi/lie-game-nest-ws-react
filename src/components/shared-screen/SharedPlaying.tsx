import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Question, Result, Score } from '../../types';
import Socket = SocketIOClient.Socket;

interface Props {
    setResultsAndScores: (results: ReadonlyArray<Result>, scores: ReadonlyArray<Score>) => void;
    setNbRounds: (nbRounds: number) => void;
}

interface State {
    readonly question: Question;
    readonly choosingLieTime: boolean;
    readonly goToResults: boolean;
    readonly answeredPlayers: string[];
    readonly nbMaxPlayers: number;
}

export default class SharedPlaying extends React.Component<Props, State> {

    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.state = {
            question: {text: '', answers: [], lies: []},
            choosingLieTime: false,
            goToResults: false,
            answeredPlayers: [],
            nbMaxPlayers: 0
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.socket.on(
            'newAnswer',
            (pseudoAnswered: string) => {
                this.setState({answeredPlayers: this.state.answeredPlayers.concat(pseudoAnswered)});
            });
        this.socket.on(
            'goToAnswering',
            () => {
                this.setState({choosingLieTime: true, answeredPlayers: []});
            });
        this.socket.on('goToResults', ({results, scores, nbRounds}) => {
            this.props.setResultsAndScores(results, scores);
            this.props.setNbRounds(nbRounds);
            this.setState({goToResults: true});
        });
    }

    componentDidMount() {
        fetch('/api/question')
            .then(result => result.json())
            .then((question: Question) => {
                const trueQuestion: Question = {text: question.text, answers: question.answers, lies: question.lies};
                this.setState({question: trueQuestion});
            })
            .catch(e => console.error(e));
        fetch('/api/nbMaxPlayers')
            .then(result => result.json())
            .then((nbMaxPlayers: number) => this.setState({nbMaxPlayers}))
            .catch(e => console.error(e));
    }

    render() {
        if (this.state.goToResults) {
            return (<Redirect to="/results"/>);
        }
        return (
            <div className="base-div-content">
                <div className="row justify-content-center">
                    <div className="col-sm-10">

                        <div className="card my-3">
                            <div className="card-header card-header-title">
                                <div>Question</div>
                            </div>
                            <div className="card-body">
                                <h1>{this.state.question.text}</h1>
                                <br/>
                                {
                                    !this.state.choosingLieTime &&
                                    <div className="row">On écrit son mito...</div>
                                }
                                {
                                    this.state.choosingLieTime &&
                                    <div className="row">et maintenant on choisit la bonne réponse !</div>
                                }
                                <br/>
                                <div className="row justify-content-center">
                                    {this.state.answeredPlayers.length + '/' + this.state.nbMaxPlayers} joueurs
                                </div>
                                <div className="row d-flex justify-content-around">
                                    {this.state.answeredPlayers.map((pseudo: string, id: number) => {
                                        return (
                                            <div key={id} className="col-sm-5 col-md-3 chips-pseudo">
                                                {pseudo}
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