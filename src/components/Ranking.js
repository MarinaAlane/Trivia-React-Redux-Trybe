import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Ranking extends Component {
  render() {
    return (
      <div>
        <h3 data-testid="ranking-title"> Ranking </h3>
        <Link to="/" data-testid="btn-go-home">
          Voltar ao início
        </Link>
      </div>
    );
  }
}

export default Ranking;
