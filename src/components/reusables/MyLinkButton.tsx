import * as React from 'react';
import { SyntheticEvent } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { History } from 'history';

interface Props {
    readonly cb: (e: SyntheticEvent<HTMLButtonElement>, history: History) => void;
    readonly type: string;
}

export default class MyButton extends React.Component<Props, {}> {
    Button: React.ComponentClass;

    constructor(props: Props) {
        super(props);
        this.Button = withRouter(({history}) => (
            <Button
                type={this.props.type}
                color="primary"
                onClick={(e) => {
                    this.props.cb(e, history);
                }}
            >
                {this.props.children}
            </Button>
        ));
    }

    render() {
        return <this.Button/>;
    }
}