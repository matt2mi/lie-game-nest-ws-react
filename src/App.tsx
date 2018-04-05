import * as React from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import Login from './containers/Login';
import NavHeader from './containers/NavHeader';
import PlayerAnswering from './containers/PlayerAnswering';
import PlayerLying from './containers/PlayerLying';
import Results from './containers/Results';
import SharedPlaying from './containers/SharedPlaying';
import SharedStart from './components/SharedStart';
import WaitingForPlayers from './components/WaitingForPlayers';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <NavHeader pseudo={''}/>
                <div className="container mt-2">
                    <Switch>
                        {/* Shared screen Routes */}
                        <Route path="/" exact={true} component={SharedStart}/>
                        <Route path="/waitingForPlayers" component={WaitingForPlayers}/>
                        <Route path="/sharedPlaying" component={SharedPlaying}/>
                        <Route path="/results" component={Results}/>

                        {/* Player screen Routes */}
                        <Route path="/login" component={Login}/>
                        <Route path="/playerLying" component={PlayerLying}/>
                        <Route path="/playerAnswering" component={PlayerAnswering}/>
                    </Switch>
                </div>
            </div>
        );
    }
}
export default App;
