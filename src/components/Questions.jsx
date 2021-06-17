import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getQuestionsSuccess, getTokenThunk } from '../redux/actions';

class Questions extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      questionsPosition: 0,
      questions: [],
      showBtn: false,
      canUpdate: true,
      randomNumber: '',
    };

    this.onClick = this.onClick.bind(this);
    this.requisitions = this.requisitions.bind(this);
    this.boolean = this.boolean.bind(this);
    this.multiple = this.multiple.bind(this);
    this.btnStyle = this.btnStyle.bind(this);
    this.getRandom = this.getRandom.bind(this);
  }

  componentDidMount() {
    this.requisitions();
  }

  onClick() {
    const correctBtn = document.querySelector('.correct-answer');
    const incorrectBtns = document.querySelectorAll('.incorrect-answer');

    this.setState((previous) => ({
      questionsPosition: previous.questionsPosition + 1,
      showBtn: false,
      canUpdate: true,
    }));

    correctBtn.style.border = '';
    incorrectBtns.forEach((btn) => {
      btn.style.border = '';
    });
  }

  getRandom() {
    const { canUpdate } = this.state;
    if (canUpdate) {
      const QUESTIONS_LENGTH = 4;
      const random = Math.floor(
        Math.random() * (QUESTIONS_LENGTH),
      );
      this.setState({ canUpdate: false, randomNumber: random });
      return random;
    }
  }

  async requisitions() {
    const { token, getQuestions } = this.props;
    getQuestions(token);
    const response = await fetch(
      `https://opentdb.com/api.php?amount=5&token=${token}`,
    );
    const data = await response.json();
    this.setState({ loading: false, questions: data.results });
    getQuestions(data.results);
  }

  btnStyle() {
    const correctBtn = document.querySelector('.correct-answer');
    const incorrectBtns = document.querySelectorAll('.incorrect-answer');

    this.setState({ showBtn: true });
    correctBtn.style.border = '3px solid rgb(6, 240, 15)';
    incorrectBtns.forEach((btn) => {
      btn.style.border = '3px solid rgb(255, 0, 0)';
    });
  }

  boolean() {
    const { questions, questionsPosition } = this.state;
    const dataTestIdCorrect = 'correct-answer';
    const dataTestIdIncorrect = 'incorrect-answer';

    const dataTestId = questions[questionsPosition].correct_answer === 'True'
      ? dataTestIdCorrect : `wrong-answer-${0}`;
    const dataTestId2 = dataTestId === dataTestIdCorrect
      ? `wrong-answer-${0}` : dataTestIdCorrect;

    return (
      <>
        <h2 data-testid="question-category">
          {questions[questionsPosition].category}
        </h2>
        <h3 data-testid="question-text">
          {questions[questionsPosition].question}
        </h3>
        <button
          type="button"
          data-testid={ dataTestId }
          className={
            dataTestId === dataTestIdCorrect ? dataTestIdCorrect : dataTestIdIncorrect
          }
          onClick={ this.btnStyle }
        >
          True
        </button>
        <button
          type="button"
          data-testid={ dataTestId2 }
          className={
            dataTestId2 === dataTestIdCorrect ? dataTestIdCorrect : dataTestIdIncorrect
          }
          onClick={ this.btnStyle }
        >
          False
        </button>
      </>
    );
  }

  multiple() {
    const { questions, questionsPosition, randomNumber } = this.state;
    const dataTestIdCorrect = 'correct-answer';
    const dataTestIdIncorrect = 'incorrect-answer';
    const incorrectAnswers = [
      ...questions[questionsPosition].incorrect_answers,
    ];
    this.getRandom();
    incorrectAnswers.splice(
      randomNumber,
      0,
      questions[questionsPosition].correct_answer,
    );

    return (
      <>
        <h2 data-testid="question-category">
          {questions[questionsPosition].category}
        </h2>
        <h3 data-testid="question-text">
          {questions[questionsPosition].question}
        </h3>
        {incorrectAnswers.map((question, index) => {
          const dataTestId3 = index === randomNumber
            ? dataTestIdCorrect : `wrong-answer-${index}`;
          return (
            <button
              data-testid={ dataTestId3 }
              key={ index }
              type="button"
              className={
                dataTestId3 === dataTestIdCorrect
                  ? dataTestIdCorrect : dataTestIdIncorrect
              }
              onClick={ this.btnStyle }
            >
              {question}
            </button>
          );
        })}
      </>
    );
  }

  render() {
    const { questions, loading, questionsPosition, showBtn } = this.state;
    console.log(questions);
    if (loading) {
      return 'Carregando...';
    }
    return (
      <div>
        {questions[questionsPosition].type === 'multiple'
          ? this.multiple()
          : this.boolean()}
        {showBtn
          ? (
            <button
              type="button"
              data-testid="btn-next"
              onClick={ this.onClick }
            >
              Próxima pergunta
            </button>
          ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getQuestions: (questions) => dispatch(getQuestionsSuccess(questions)),
  getToken: () => dispatch(getTokenThunk()),
});

const mapStateToProps = (state) => ({
  token: state.game.token,
  questions: state.game.questions,
  loadingQuestions: state.game.loadingQuestions,
  loadingToken: state.game.loadingToken,
});

Questions.propTypes = {
  getQuestions: PropTypes.func,
  token: PropTypes.string,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Questions);