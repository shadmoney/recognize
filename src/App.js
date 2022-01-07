import React from 'react';
import Sidebar from './components/sidebar/sidebar';
import Create from './pages/create/create';
import { Switch, Route, Redirect } from "react-router-dom";

import './App.css';
import Home from './pages/home/home';
import Mint from './pages/mint/mint';
import Explore from './pages/explore/explore';
import ConnectWallet from './components/wallet/wallet';
import Preview from './pages/preview/preview';
import Footer from './components/footer/footer';
import Overlay from './components/overlay/overlay';
import Rules from './components/rules/rules';

function App() {
  return (
    <div className="App">
      <div className="App-Container">
        <Overlay />
        <Sidebar />
        <div className="Wallet-Wrapper">
          <ConnectWallet>connect-wallet</ConnectWallet>
        </div>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route exact path="/home" component={Home} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/mint" component={Mint} />
          <Route exact path="/explore" component={Explore} />
          <Route exact path="/preview" component={Preview} />
          <Route exact path="/rules" component={Rules} />
        </Switch>

        <div className="Footer">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App;