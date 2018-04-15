import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Lie, Question, Rank } from '../../types';
import Waiting from '../reusables/Waiting';
import GameOver from '../reusables/GameOver';
import TimerProgress from '../reusables/TimerProgress';
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
    readonly rank: number;
    readonly total: number;
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
            gameOver: false,
            rank: 0,
            total: 0
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

    chooseLie(lie: Lie): void {
        this.socket.on('nextQuestion', () => this.setState({waiting: false, goToLying: true, gameOver: false}));
        this.socket.on('gameOver', (ranks: Rank[]) => {
            this.setState({
                rank: ranks.filter((rank: Rank) => rank.pseudo === this.props.pseudo)[0].value,
                total: ranks.length,
                waiting: false,
                goToLying: false,
                gameOver: true
            });
        });
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
            return (<GameOver rank={this.state.rank} total={this.state.total}/>);
        }
        return (
            <div className="base-div-content">
                <div className="row justify-content-center">
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header card-header-title">
                                Trouve la bonne réponse
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">{this.state.question.text}</div>
                                </div>
                                <div className="row d-flex justify-content-around">
                                    {this.state.lies
                                        .filter(lie => !lie.pseudos.some(pseudo => pseudo === this.props.pseudo))
                                        .map((lie, id) => (
                                            <div
                                                key={id}
                                                className="col-sm-5 col-md-3 chips-pseudo pointer mb-3"
                                                onClick={() => this.chooseLie(lie)}
                                            >
                                                {lie.lieValue}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <TimerProgress counterMax={30}/>
                </div>
            </div>
        );
    }
}