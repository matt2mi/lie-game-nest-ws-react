import * as React from 'react';
import { Redirect } from 'react-router';
import * as io from 'socket.io-client';
import { Question } from '../../types';
import Waiting from '../reusables/Waiting';
import TimerProgress from '../reusables/TimerProgress';
import Socket = SocketIOClient.Socket;

interface Props {
    readonly pseudo: string;
}

interface State {
    readonly question: Question;
    readonly lieAnswered: string;
    readonly waiting: boolean;
    readonly goToAnswering: boolean;
    readonly isGoodAnswer: boolean;
}

export default class PlayerLying extends React.Component<Props, State> {

    socket: Socket;

    constructor(props: Props) {
        super(props);

        this.changeValue = this.changeValue.bind(this);
        this.sendLie = this.sendLie.bind(this);

        this.state = {
            question: {text: '', answers: [], lies: []},
            lieAnswered: '',
            waiting: false,
            goToAnswering: false,
            isGoodAnswer: false
        };

        const url = window.location.href;
        this.socket = io.connect('http://' + url.slice(7, url.length).split(':')[0] + ':3001');
    }

    componentWillMount() {
        // TODO : only one call => question to store ???
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

    changeValue(event: React.FormEvent<HTMLInputElement>): void {
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

    sendLie(): void {
        this.socket.on('goToAnswering', () => this.setState({waiting: false, goToAnswering: true}));
        this.socket.emit('lieAnswered', {
            lieValue: this.state.lieAnswered,
            pseudo: this.props.pseudo
        });
        this.setState({waiting: true});
    }

    render() {
        if (this.state.goToAnswering) {
            return (<Redirect to="playerAnswering"/>);
        } else if (this.state.waiting) {
            return (<Waiting/>);
        }
        return (
            <div className="base-div-content">
                <div className="row justify-content-center">
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header card-header-title">
                                Invente un mito
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.sendLie}>
                                    <div className="row">
                                        <div className="col-12">{this.state.question.text}</div>
                                    </div>
                                    <br/>
                                    <div className="row justify-content-center">
                                        <div className="form-group">
                                            <label>Mito :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                onChange={this.changeValue}
                                            />
                                            {this.state.isGoodAnswer ?
                                                <div>Good answer ! Now, lie !</div>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={this.state.isGoodAnswer}
                                        >
                                            Envoyer
                                        </button>
                                    </div>
                                </form>
                                <br/>
                                <TimerProgress counterMax={30}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}