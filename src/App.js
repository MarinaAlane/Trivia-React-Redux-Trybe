import React from 'react';
import { Switch, Route } from 'react-router-dom';
import logo from './trivia.png';
import Login from './pages/Login';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <img src={ logo } className="App-logo" alt="logo" />
      <Switch>
        <Route exact path="/" component={ Login } />
      </Switch>
    </div>
  );
}
