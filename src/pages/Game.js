import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getApiQuestionsThunk, setScoreAction } from '../actions';
import Header from './Header';

class Game extends React.Component {
  constructor() {
    super();
    this.handlePosition = this.handlePosition.bind(this);
    this.getUserRanking = this.getUserRanking.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
    this.changeBorders = this.changeBorders.bind(this);
    this.dischangeBorders = this.dischangeBorders.bind(this);
    this.createNextButton = this.handleNextButton.bind(this);

    const milliSeconds = 1000;

    this.state = {
      questionNumber: 0,
      seconds: 30,
      countDown: setInterval(() => {
        this.setState(
          (state) => ({
            seconds: state.seconds - 1,
          }),
        );
      }, milliSeconds),
    };
  }

  componentDidMount() {
    const player = {
      player: {
        name: 'Nome da Pessoa',
        assertions: 0,
        score: 0,
        gravatarEmail: 'email@pessoa.com',
      },
    };
    localStorage.setItem('state', JSON.stringify(player));
  }

  componentDidUpdate() {
    const { seconds, countDown } = this.state;

    if (seconds === 0) {
      this.changeBorders();
      clearInterval(countDown);
      this.handleNextButton();
    }
  }

  getUserRanking(difficulty) {
    const { seconds } = this.state;
    const fixedPoint = 10;
    let finalPoint = 0;
    let difficultyPoint = 0;
    const easy = 1;
    const medium = 2;
    const hard = 3;
    const timer = seconds;
    if (difficulty === 'easy') {
      difficultyPoint = easy;
    } else if (difficulty === 'medium') {
      difficultyPoint = medium;
    } else if (difficulty === 'hard') {
      difficultyPoint = hard;
    }
    finalPoint += fixedPoint + (timer * difficultyPoint);
    this.changeBorders();
    this.updateLocalStorage(finalPoint);
  }

  handleNextButton() {
    const { questionNumber } = this.state;
    const LAST_QUESTION = 4;

    if (questionNumber === 0) { // Se for a primeira pergunta:
      const nextButton = document.createElement('button');
      nextButton.innerText = 'Próxima';
      nextButton.id = 'nextButton';
      document.querySelector('.nextButtonDiv').appendChild(nextButton);

      nextButton.addEventListener('click', () => {
        this.setState({
          questionNumber: questionNumber + 1,
          seconds: 30,
        });
        this.handlePosition();
        this.dischangeBorders();
      });
    } else if (questionNumber < LAST_QUESTION) { // Se pergunta 1 a 4:
      const nextButton = document.getElementById('nextButton');
      nextButton.addEventListener('click', () => {
        this.setState({
          questionNumber: questionNumber + 1,
          seconds: 30,
        });
        this.handlePosition();
        this.dischangeBorders();
      });
    } else {
      const nextButton = document.getElementById('nextButton');
      nextButton.innerText = 'Ver Ranking';
      nextButton.addEventListener('click', () => <Link to="/ranking">Oi</Link>);
    }
  }

  changeBorders() {
    const { countDown } = this.state;
    const correctAnswer = document.getElementsByClassName('correct-answer');
    correctAnswer[0].style.border = '3px solid rgb(6, 240, 15)';
    correctAnswer[0].disabled = true;

    const incorrectAnswer = document.querySelectorAll('.wrong-answer');
    for (let index = 0; index < incorrectAnswer.length; index += 1) {
      incorrectAnswer[index].style.border = '3px solid rgb(255, 0, 0)';
      incorrectAnswer[index].disabled = true;
    }
    clearInterval(countDown);
    this.handleNextButton();
  }

  dischangeBorders() {
    const { countDown } = this.state;
    const correctAnswer = document.getElementsByClassName('correct-answer');
    correctAnswer[0].style.border = '1px solid black';
    correctAnswer[0].disabled = false;

    const incorrectAnswer = document.querySelectorAll('.wrong-answer');
    for (let index = 0; index < incorrectAnswer.length; index += 1) {
      incorrectAnswer[index].style.border = '1px solid black';
      incorrectAnswer[index].disabled = false;
    }
    clearInterval(countDown);
  }

  updateLocalStorage(score) {
    const { getName, getUrl, getScore } = this.props;
    const ranking = [
      { name: getName, score, picture: getUrl },
    ];
    const player = {
      player: {
        name: getName,
        assertions: 0,
        score,
        gravatarEmail: 'email@pessoa.com',
      },
    };

    localStorage.setItem('ranking', JSON.stringify(ranking));
    localStorage.setItem('state', JSON.stringify(player));
    getScore(score);
  }

  handlePosition() {
    const { questionNumber } = this.state;
    console.log('questin num', questionNumber);
    const { results } = this.props;
    if (!results) {
      return;
    }
    const categoryFilter = results
      .filter((category) => results.indexOf(category) === questionNumber);
    return categoryFilter.map((category) => (
      <div key={ category }>
        <h3 data-testid="question-category">
          {category.category}
        </h3>
        <br />
        <h2 data-testid="question-text">
          {category.question}
        </h2>
        <br />
        {category.incorrect_answers.map((incorrect, index) => (
          <button
            data-testid={ `wrong-answer-${index}` }
            key={ index }
            type="button"
            onClick={ this.changeBorders }
            className="wrong-answer responses"
          >
            {incorrect}

          </button>
        ))}
        <button
          data-testid="correct-answer"
          type="button"
          onClick={ () => this.getUserRanking(category.difficulty) }
          className="correct-answer responses"
        >
          {category.correct_answer}

        </button>
        <br />
        <br />
        <div className="nextButtonDiv" />

      </div>));
  }

  render() {
    const { seconds } = this.state;
    return (
      <>
        <Header />
        <div>
          <span>Tempo Restante: </span>
          <strong>{seconds}</strong>
          {this.handlePosition()}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getThunk: (state) => dispatch(getApiQuestionsThunk(state)),
  getScore: (state) => dispatch(setScoreAction(state)),
});

const mapStateToProps = (state) => ({
  results: state.game.questions,
  isLoading: state.game.isLoading,
  getName: state.player.name,
  getScore: state.player.score,
  getUrl: state.player.gravatar,

});

Game.propTypes = {
  results: PropTypes.string.isRequired,
  getName: PropTypes.string.isRequired,
  getScore: PropTypes.number.isRequired,
  getUrl: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
