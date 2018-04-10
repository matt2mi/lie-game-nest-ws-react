import * as React from 'react';
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';
import NavLink from 'reactstrap/lib/NavLink';

interface Props {
    readonly pseudo: string;
}

interface State {
    isOpen: boolean;
}

export default class NavHeader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        if (window.innerWidth <= 767) {
            this.setState({
                isOpen: !this.state.isOpen
            });
        }
    }

    render() {
        return (
            <div>
                <Navbar color="faded" light={true} expand="md" fixed="top">
                    <NavbarBrand>Lie Game {this.props.pseudo ? ' - ' + this.props.pseudo : ''}</NavbarBrand>
                    <Nav navbar={true}>
                        <NavItem>
                            <NavLink>Recommencer</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}