import * as React from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import Login from './containers/players-screens/Login';
import NavHeader from './containers/reusables/NavHeader';
import PlayerAnswering from './containers/players-screens/PlayerAnswering';
import PlayerLying from './containers/players-screens/PlayerLying';
import SharedResults from './containers/shared-screen/SharedResults';
import SharedPlaying from './containers/shared-screen/SharedPlaying';
import SharedStart from './components/shared-screen/SharedStart';
import SharedWaitingForPlayers from './containers/shared-screen/SharedWaitingForPlayers';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <NavHeader pseudo={''}/>
                <div className="container mt-2">
                    <Switch>
                        {/* Shared screen Routes */}
                        <Route path="/" exact={true} component={SharedStart}/>
                        <Route path="/waitingForPlayers" component={SharedWaitingForPlayers}/>
                        <Route path="/playing" component={SharedPlaying}/>
                        <Route path="/results" component={SharedResults}/>

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
