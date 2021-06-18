import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HeaderTriviaGame from '../components/HeaderTriviaGame';
import Question from '../components/Question';
// import Timer from '../components/Timer';
import Answer from '../components/Answer';
import ButtonNext from '../components/ButtonNext';
import { shuffle } from '../helper';

class TriviaGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      disableBtn: true,
    };
    this.handleIndexIncrementOnClick = this.handleIndexIncrementOnClick.bind(this);
    this.changeBorder = this.changeBorder.bind(this);
  }

  toggleBtn(bool) {
    this.setState({
      disableBtn: bool,
    });
  }

  changeBorder() {
    const btnAnswers = document.getElementsByName('answer');
    btnAnswers.forEach((btn) => {
      if (btn.getAttribute('data-testid') === 'correct-answer') {
        btn.style = 'border: 3px solid rgb(6, 240, 15)';
      } else {
        btn.style = 'border: 3px solid rgb(255, 0, 0)';
      }
    });
    this.toggleBtn(false);
  }

  resetBorder() {
    const btnAnswers = document.getElementsByName('answer');
    btnAnswers.forEach((btn) => {
      btn.style = '';
    });
  }

  handleIndexIncrementOnClick() {
    this.setState((oldState) => ({
      index: oldState.index + 1,
    }));
    this.toggleBtn(true);
    this.resetBorder();
  }

  answersRandom(index) {
    const { questions } = this.props;
    if (questions.length) {
      const correct = {
        answer: questions[index].correct_answer,
        dataTestId: 'correct-answer',
      };

      const incorrect = questions[index].incorrect_answers.map((incorrectAnswer, i) => ({
        answer: incorrectAnswer,
        dataTestId: `wrong-answer-${i}`,
      }));

      const answers = [...incorrect,
        correct];
      return shuffle(answers);
    }
  }

  render() {
    const { questions } = this.props;
    const { index, disableBtn } = this.state;
    const questionsRandom = questions.length ? this.answersRandom(index) : 'xablau';
    return (
      <div>
        <HeaderTriviaGame />
        <div>
          {questions.length && <Question index={ index } />}
          {/* <Timer /> */}
        </div>
        <div>
          {questions.length && <Answer
            answers={ questionsRandom }
            changeBorder={ this.changeBorder }
            /* toggleBtn={ this.toggleBtn } */
          />}
          <ButtonNext
            onClick={ this.handleIndexIncrementOnClick }
            disableBtn={ disableBtn }
            /* toggleBtn={ this.toggleBtn } */
          />
        </div>
      </div>
    );
  }
}

TriviaGame.propTypes = {
  questions: PropTypes.arrayOf(),
};

TriviaGame.defaultProps = {
  questions: [],
};

const mapStateToProps = (state) => ({
  // isFetching: state.user.isFetching,
  questions: state.user.questions,
});

/* const mapDispatchToProps = (dispatch) => ({
 funcao que atualiza pontos
}); */

export default connect(mapStateToProps, null)(TriviaGame);
