import * as React from 'react';
import { SyntheticEvent } from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

interface Lie {
    pseudo: string;
    lieValue: string;
}

interface Question {
    text: string;
    answers: string[];
    lies: string[];
}

interface Props {
    readonly pseudo: string;
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
        this.newGame = this.newGame.bind(this);

        this.state = {
            question: {text: '', answers: [], lies: []},
            lieAnswered: '',
            lies: [],
            lieSent: false,
            displayLies: false,
            goToResults: false,
            isGoodAnswer: false,
            currentPseudo: this.props.pseudo // TODO PSEUDO
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
        this.socket.on('newGame', this.newGame);
    }

    newGame() {
        this.setState({
            question: {text: '', answers: [], lies: []},
            lieAnswered: '',
            lies: [],
            lieSent: false,
            displayLies: false,
            goToResults: false,
            isGoodAnswer: false,
            currentPseudo: this.props.pseudo // TODO PSEUDO
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
        console.log('loadlies', lies);
        this.setState({lies, displayLies: true});
    }

    sendLie() {
        this.setState({lieSent: true});
        this.socket.on('loadLies', (lies: Lie[]) => this.loadLies(lies));
        this.socket.emit('lieAnswered', {
            lieValue: this.state.lieAnswered,
            pseudo: this.props.pseudo // TODO PSEUDO
        });
    }

    chooseLie(e: SyntheticEvent<HTMLButtonElement>, lie: Lie) {
        this.setState({displayLies: false});
        e.preventDefault();
        console.log('lie', lie);
        this.socket.on('goToResults', () => {
            this.setState({goToResults: true});
        });
        this.socket.emit('lieChoosen', {
            lie: {
                value: lie.lieValue,
                pseudo: lie.pseudo
            },
            pseudo: this.props.pseudo
        }); // TODO PSEUDO
    }

    componentWillMount() {
        fetch('/api/question')
            .then(result => {
                return result.json();
            })
            .then((question: Question) => {
                const trueQuestion: Question = {text: question.text, answers: question.answers, lies: question.lies};
                this.setState({question: trueQuestion});
            })
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
                                {this.state.lies.map(lie => {
                                    if (lie.pseudo !== this.state.currentPseudo) {
                                        return (<div className="col" key={lie.pseudo}>
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
}