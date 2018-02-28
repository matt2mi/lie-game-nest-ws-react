import * as React from 'react';
import { SyntheticEvent } from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Lie, Question, Result, Score } from '../types';
import Socket = SocketIOClient.Socket;

interface Props {
    readonly pseudo: string;
    setResultsAndScores: (results: ReadonlyArray<Result>, scores: ReadonlyArray<Score>) => void;
    setNbRounds: (nbRounds: number) => void;
}

interface State {
    readonly question: Question;
    readonly lieAnswered: string;
    readonly lies: Lie[];
    readonly lieSent: boolean;
    readonly displayLies: boolean;
    readonly goToResults: boolean;
    readonly isGoodAnswer: boolean;
    readonly currentPseudo?: string;
}

export default class Playing extends React.Component<Props, State> {
    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.changeValue = this.changeValue.bind(this);
        this.loadLies = this.loadLies.bind(this);
        this.sendLie = this.sendLie.bind(this);
        this.chooseLie = this.chooseLie.bind(this);

        this.state = {
            question: {text: '', answers: [], lies: []},
            lieAnswered: '',
            lies: [],
            lieSent: false,
            displayLies: false,
            goToResults: false,
            isGoodAnswer: false,
            currentPseudo: this.props.pseudo
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
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
    }

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        if (this.state.question.answers.some(answer => answer === event.currentTarget.value)) {
            this.setState({
                lieAnswered: event.currentTarget.value,
                isGoodAnswer: true
            });
        } else {
            this.setState({
                lieAnswered: event.currentTarget.value,
                isGoodAnswer: false
            });
        }
    }

    loadLies(lies: Lie[]) {
        this.setState({lies, displayLies: true});
    }

    sendLie() {
        this.setState({lieSent: true});
        this.socket.on('loadLies', (lies: Lie[]) => this.loadLies(lies));
        this.socket.emit('lieAnswered', {
            lieValue: this.state.lieAnswered,
            pseudo: this.props.pseudo
        });
    }

    chooseLie(e: SyntheticEvent<HTMLButtonElement>, lie: Lie) {
        this.setState({displayLies: false});
        e.preventDefault();
        this.socket.on('goToResults', ({results, scores, nbRounds}) => {
            this.props.setResultsAndScores(results, scores);
            this.props.setNbRounds(nbRounds);
            this.setState({goToResults: true});
        });
        this.socket.emit('lieChoosen', {
            lie: {
                value: lie.lieValue,
                pseudos: lie.pseudos
            },
            pseudo: this.props.pseudo
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
                        <div className="col">{this.state.question.text}</div>
                    </div>
                    <br/>
                    <div className="row">
                        {!this.state.lieSent ?
                            <div className="col">
                                <form onSubmit={this.sendLie}>
                                    <div className="form-group">
                                        <label>Mensonge</label>
                                        <input type="text" className="form-control" onChange={this.changeValue}/>
                                        {this.state.isGoodAnswer ?
                                            <div>Good answer ! Now, lie !</div>
                                            : null}
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={this.state.isGoodAnswer}
                                    >
                                        Envoyer
                                    </button>
                                </form>
                            </div>
                            : null}

                        {this.state.displayLies ?
                            <div>
                                <div className="col">
                                    Choisis la bonne réponse :
                                </div>
                                {this.shuffle(this.state.lies).map((lie, id) => {
                                    if (!lie.pseudos.some(pseudo => pseudo === this.state.currentPseudo)) {
                                        return (<div className="col" key={id}>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={(e) => this.chooseLie(e, lie)}
                                            >
                                                {lie.lieValue}
                                            </button>
                                        </div>);
                                    }
                                    return null;
                                })}
                            </div>
                            : null}
                    </div>
                </div>
            </div>
        );
    }

    private shuffle(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}