import * as React from 'react';

interface Props {
}

interface State {
    counter: number;
    dots: string[];
}

export default class Waiting extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            counter: 0,
            dots: []
        };

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.tick();
    }

    tick() {
        if (this.state.dots.length < 4) {
            setTimeout(
                () => {
                    this.setState({dots: this.state.dots.concat('.')});
                    this.tick();
                },
                1000);
        } else {
            this.setState({dots: []});
            this.tick();
        }
    }

    render() {
        return (
            <div className="base-div-content">
                <div className="row justify-content-center">
                    <div className="waiting-title text-left">
                        <h1>Waiting{this.state.dots}</h1>
                    </div>
                </div>
            </div>
        );
    }
}