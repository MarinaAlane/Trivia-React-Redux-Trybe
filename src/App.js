import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';
import Game from './pages/Game';
import Login from './pages/Login';
import Feedback from './pages/Feedback';
import themes from './styles';
import Header from './pages/Game/header';
import Ranking from './pages/Ranking/index';
import { listStyle } from './pages/Ranking/styles';

const App = () => (
  <ThemeProvider theme={ themes.light }>
    <Switch>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>

      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/game">
        <Header testId="header-score" />
        <Game />
      </Route>

      <Route exact path="/feedback">
        <Header testId="header-score" />
        <Feedback />
      </Route>

      <Route exact path="/settings">
        <h1 data-testid="settings-title">Settings</h1>
      </Route>

      <Route exact path="/ranking">
        <h1>Ranking</h1>
        <listStyle>
          <Ranking />
        </listStyle>
      </Route>

      <Route exact path="*">
        <h1>Not Found</h1>
      </Route>
    </Switch>
  </ThemeProvider>
);

export default App;
