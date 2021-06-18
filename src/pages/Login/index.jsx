import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { tokenResponseAPI } from '../../actions/tokenAction';
import { getQuestionsThunk } from '../../actions/gameActions';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        name: '',
        email: '',
      },
      playBtn: {
        isDisabled: true,
      },
    };

    this.handleInput = this.handleInput.bind(this);
    this.goToGamePage = this.goToGamePage.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { fields } = this.state;
    const nameHasChanged = prevState.fields.name !== fields.name;
    const emailHasChanged = prevState.fields.email !== fields.email;
    if (nameHasChanged || emailHasChanged) {
      this.buttonValidation();
    }
  }

  handleInput({ target: { id, value } }) {
    const { fields } = this.state;
    this.setState({
      fields: { ...fields, [id]: value },
    });
  }

  buttonValidation() {
    const { fields, playBtn } = this.state;

    this.setState({
      playBtn: { ...playBtn, isDisabled: !(fields.name !== '' && fields.email !== '') },
    });
  }

  goToGamePage(event) {
    event.preventDefault();
    const { fields: user } = this.state;
    const { getToken, getQuestions, history: { push } } = this.props;
    getToken(user);
    getQuestions();
    push('/game');
  }

  render() {
    const { playBtn, fields } = this.state;
    return (
      <form onSubmit={ this.goToGamePage }>
        <input
          type="text"
          id="name"
          placeholder="Name"
          onChange={ this.handleInput }
          value={ fields.name }
          data-testid="input-player-name"
        />
        <input
          type="text"
          id="email"
          placeholder="E-mail"
          onChange={ this.handleInput }
          value={ fields.email }
          data-testid="input-gravatar-email"
        />
        <button
          type="submit"
          disabled={ playBtn.isDisabled }
          data-testid="btn-play"
        >
          Jogar
        </button>
        <Link to="/settings">
          <button
            type="button"
            data-testid="btn-settings"
          >
            Configurações
          </button>
        </Link>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getToken: (user) => dispatch(tokenResponseAPI(user)),
  getQuestions: () => dispatch(getQuestionsThunk()),
});

Login.propTypes = {
  getToken: PropTypes.func.isRequired,
  getQuestions: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }) }.isRequired;

export default connect(null, mapDispatchToProps)(Login);
