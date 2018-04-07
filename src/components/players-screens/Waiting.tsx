import * as React from 'react';

interface Props {
}

interface State {
}

export default class Waiting extends React.Component<Props, State> {
    render() {
        return (
            <div className="base-div-content">
                <h1>Waiting...</h1>
            </div>
        );
    }
}