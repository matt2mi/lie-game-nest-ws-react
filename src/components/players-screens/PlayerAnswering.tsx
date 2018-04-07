import * as React from 'react';
import { SyntheticEvent } from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Lie, Question } from '../../types';
import Waiting from './Waiting';
import GameOver from './GameOver';
import Socket = SocketIOClient.Socket;

interface Props {
    readonly pseudo: string;
}

interface State {
    readonly question: Question;
    readonly lies: Lie[];
    readonly waiting: boolean;
    readonly goToLying: boolean;
    readonly gameOver: boolean;
}

export default class PlayerAnswering extends React.Component<Props, State> {

    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.chooseLie = this.chooseLie.bind(this);
        this.shuffleLies = this.shuffleLies.bind(this);

        this.state = {
            question: {text: '', answers: [], lies: []},
            lies: [],
            waiting: false,
            goToLying: false,
            gameOver: false
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
        fetch('/api/playersLies')
            .then(result => result.json())
            .then((lies: Lie[]) => {
                this.setState({lies: this.shuffleLies(lies)});
            })
            .catch(e => {
                console.error(e);
            });
    }

    chooseLie(e: SyntheticEvent<HTMLButtonElement>, lie: Lie): void {
        e.preventDefault();
        this.socket.on('nextQuestion', () => this.setState({waiting: false, goToLying: true, gameOver: false}));
        this.socket.on('gameOver', () => this.setState({waiting: false, goToLying: false, gameOver: true}));
        this.socket.emit('lieChoosen', {
            lie: {
                value: lie.lieValue,
                pseudos: lie.pseudos
            },
            pseudo: this.props.pseudo
        });
        this.setState({waiting: true});
    }

    shuffleLies(lies: Lie[]): Lie[] {
        for (let i = lies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lies[i], lies[j]] = [lies[j], lies[i]];
        }
        return lies;
    }

    render() {
        if (this.state.waiting) {
            return (<Waiting/>);
        } else if (this.state.goToLying) {
            return (<Redirect to="/playerLying"/>);
        } else if (this.state.gameOver) {
            return (<GameOver/>);
        }
        return (
            <div className="base-div-content">
                <div className="card">
                    <div className="row">
                        <div className="col">{this.state.question.text}</div>
                    </div>
                    <br/>
                    <div className="row">
                        <div>
                            <div className="col">
                                Trouve la bonne réponse :
                            </div>
                            {this.state.lies
                                .filter(lie => !lie.pseudos.some(pseudo => pseudo === this.props.pseudo))
                                .map((lie, id) => (
                                    <div className="col" key={id}>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={(e) => this.chooseLie(e, lie)}
                                        >
                                            {lie.lieValue}
                                        </button>
                                    </div>))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}