import * as React from 'react';

interface Props {
    counterMax: number;
}

interface State {
    counter: number;
}

const stopCounterValue = 0;

export default class TimerProgress extends React.Component<Props, State> {
    durationStyle = {
        animation: 'spinnerClockMinRotate ' + this.props.counterMax + 's linear infinite'
    };

    constructor(props: Props) {
        super(props);

        this.state = {counter: this.props.counterMax};

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.tick();
    }

    tick() {
        if (this.state.counter > stopCounterValue) {
            setTimeout(
                () => {
                    this.setState({counter: this.state.counter - 1});
                    this.tick();
                },
                1000);
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.counter > stopCounterValue &&
                    <div className="row justify-content-center">
                        {this.state.counter + 'sec'}
                    </div>
                }
                <div className="row justify-content-center">
                    {
                        this.state.counter > stopCounterValue &&
                        <div className="spinnerClock">
                            <div className="counter">{this.state.counter + 'sec'}</div>
                            <div className="spinnerClock__clock"/>
                            <div className="spinnerClock__hand" style={this.durationStyle}/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}