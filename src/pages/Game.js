import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Game extends React.Component {
  componentDidUpdate() {
    const { token } = this.props;
    localStorage.setItem('token', JSON.stringify(token));
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.game.token,
});

Game.propTypes = {
  token: PropTypes.string,
}.isRequired;

export default connect(mapStateToProps)(Game);
