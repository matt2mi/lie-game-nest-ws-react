import * as React from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import Login from './containers/Login';
import WaitingPlayers from './components/WaitingPlayers';
import Playing from './components/Playing';
import Results from './components/Results';
import NavHeader from './components/NavHeader';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <NavHeader pseudo={'pseudo'}/>
                <div className="container mt-2">
                    <Switch>
                        <div>
                            <Route path="/" exact={true} component={Login}/>
                            <Route path="/waiting" component={WaitingPlayers}/>
                            <Route path="/playing" component={Playing}/>
                            <Route path="/results" component={Results}/>
                        </div>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
