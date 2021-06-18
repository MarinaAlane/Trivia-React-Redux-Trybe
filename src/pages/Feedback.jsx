import React, { Component } from 'react';
import { connect } from 'react-redux';
import { string, shape } from 'prop-types';
import { Link } from 'react-router-dom';

import md5 from 'crypto-js/md5';
import { showFeedbackMessage } from '../utils/functions';

class Feedback extends Component {
  render() {
    const { user } = this.props;
    const { name, email } = user;
    const hash = md5(email).toString();
    const storage = JSON.parse(localStorage.state);
    const { score, assertions } = storage.player;
    return (
      <>
        <header>
          <img src={ `https://www.gravatar.com/avatar/${hash}.png` } alt="Gravatar" data-testid="header-profile-picture" />
          <p data-testid="header-player-name">{`Jogador ${name}`}</p>
          <p data-testid="header-score">{ score }</p>
        </header>
        <section>
          <p>
            Placar
            <span data-testid="feedback-total-score">{ score }</span>
          </p>
          <p>
            Acertos
            <span data-testid="feedback-total-question">{ assertions }</span>
          </p>
        </section>
        <p data-testid="feedback-text">
          {showFeedbackMessage(storage.player.assertions)}
        </p>
        <Link to="/">
          <button
            type="button"
            data-testid="btn-play-again"
          >
            Jogar novamente
          </button>
        </Link>
        <Link to="/ranking">
          <button
            type="button"
            data-testid="btn-ranking"
          >
            Ver Ranking
          </button>
        </Link>
      </>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user,
});

Feedback.propTypes = {
  user: shape({
    name: string,
    email: string,
  }).isRequired,
};

export default connect(mapStateToProps)(Feedback);