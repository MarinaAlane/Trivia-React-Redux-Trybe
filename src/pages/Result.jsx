import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { getLocalStorage, redirect } from '../services';

class Result extends Component {
  constructor() {
    super();
    this.feedbackMessage = this.feedbackMessage.bind(this);
  }

  componentDidMount() {
    const { username, score, userImg } = this.props;
    const previousState = JSON.parse(localStorage.getItem('ranking')) || [];
    localStorage.setItem('ranking', JSON.stringify(
      [...previousState, { name: username, score, picture: userImg }],
    ));
  }

  feedbackMessage() {
    const TRES = 3;
    const { assertions } = this.props;
    const msg = (assertions < TRES) ? 'Podia ser melhor...' : 'Mandou bem!';
    return msg;
  }

  render() {
    return (
      <div>
        <Header />
        <h3 data-testid="feedback-text">{this.feedbackMessage()}</h3>
        <h3 data-testid="feedback-total-score">{getLocalStorage('score')}</h3>
        <h3 data-testid="feedback-total-question">{getLocalStorage('assertions')}</h3>
        <button
          data-testid="btn-play-again"
          onClick={ () => redirect.call(this, '/') }
          type="button"
        >
          Jogar Novamente
        </button>
        <button
          data-testid="btn-ranking"
          onClick={ () => redirect.call(this, '/ranking') }
          type="button"
        >
          Ver Ranking
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assertions: state.trivia.correctAnswers,
    userImg: state.gravatar.url,
    username: state.user.username,
    score: state.trivia.score,
  };
}

Result.propTypes = {
  assertions: PropTypes.number,
}.isRequired;
export default connect(mapStateToProps)(Result);