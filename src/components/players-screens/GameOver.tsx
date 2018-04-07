import * as React from 'react';

interface Props {
}

interface State {
}

export default class GameOver extends React.Component<Props, State> {
    render() {
        return (
            <div className="base-div-content">
                <h1>Terminé !!</h1>
            </div>
        );
    }
}