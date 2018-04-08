import * as React from 'react';
import { Redirect } from 'react-router';

interface Props {
}

interface State {
    nbPlayersExpected: number;
    goToWaitingForPlayers: boolean;
}

export default class SharedStart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            nbPlayersExpected: 2,
            goToWaitingForPlayers: false
        };

        this.changeValue = this.changeValue.bind(this);
        this.go = this.go.bind(this);
    }

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({nbPlayersExpected: parseInt(event.currentTarget.value, 10)});
        event.preventDefault();
    }

    go() {
        fetch(new Request('api/nbPlayersExpected', {
            method: 'POST',
            body: JSON.stringify({nbPlayersExpected: this.state.nbPlayersExpected}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })).catch(e => console.error(e));

        this.setState({goToWaitingForPlayers: true});
    }

    render() {
        if (this.state.goToWaitingForPlayers) {
            return (<Redirect to="/waitingForPlayers"/>);
        } else {
            return (
                <div className="base-div-content">
                    <div className="row mt-3 justify-content-center">
                        <div className="card">
                            <div className="card-header">
                                start the party
                            </div>
                            <div className="card-block p-3">
                                <form>
                                    <div className="row">
                                        <div className="form-group">
                                            <label>Combien de joueurs ?</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                onChange={this.changeValue}
                                                min={2}
                                                max={8}
                                                value={this.state.nbPlayersExpected}
                                            />
                                        </div>
                                    </div>
                                </form>

                                <div className="row justify-content-center">
                                    <button className="btn btn-success" onClick={this.go}>Démarrer !</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}