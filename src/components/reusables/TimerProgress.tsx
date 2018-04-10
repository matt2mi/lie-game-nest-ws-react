import * as React from 'react';
import Progress from 'reactstrap/lib/Progress';

interface Props {
    counterMax: number;
}

interface State {
    counter: number;
}

export default class TimerProgress extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {counter: 0};

        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.tick();
    }

    tick() {
        if (this.state.counter < this.props.counterMax) {
            setTimeout(
                () => {
                    this.setState({counter: this.state.counter + 1});
                    this.tick();
                },
                1000);
        }
    }

    render() {
        return (
            <Progress
                animated={true}
                color={this.state.counter <= this.props.counterMax * 3 / 5 ?
                    'success' : this.state.counter <= this.props.counterMax * 4 / 5 ?
                        'warning' : 'danger'}
                value={this.state.counter * 100 / this.props.counterMax}
            />
        );
    }
}