import * as React from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import Login from './containers/Login';
import NavHeader from './containers/NavHeader';
import Playing from './containers/Playing';
import WaitingPlayers from './components/WaitingPlayers';
import Results from './components/Results';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <NavHeader pseudo={''}/>
                <div className="container mt-2">
                    <Switch>
                        <Route path="/" exact={true} component={Login}/>
                        <Route path="/waiting" component={WaitingPlayers}/>
                        <Route path="/playing" component={Playing}/>
                        <Route path="/results" component={Results}/>
                    </Switch>
                </div>
            </div>
        );
    }
}
export default App;
