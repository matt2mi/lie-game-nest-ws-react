import * as React from 'react';
import { Redirect } from 'react-router';

interface Props {
}

interface State {
    goToWaiting: boolean;
}

export default class SharedScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {goToWaiting: false};

        this.go = this.go.bind(this);
    }

    go() {
        this.setState({goToWaiting: true});
    }

    render() {
        if (this.state.goToWaiting) {
            return (<Redirect to="/waiting"/>);
        } else {
            return (
                <div className="base-div-content">
                    <div className="row mt-3 justify-content-center">
                        <div className="card">
                            <div className="card-header">
                                start the party
                            </div>
                            <div className="card-block p-3">
                                <div className="row justify-content-center">
                                    TODO : nb joueurs fixe ou juste nb max ??
                                </div>
                                <div className="row justify-content-center">
                                    <button className="btn btn-success" onClick={this.go}>Go on !</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}