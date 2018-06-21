import React from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

const WindowContext = React.createContext();

class WindowProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      window: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentWillMount() {
    window.addEventListener('resize', debounce(this.updateWindowDimensions, 100));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.updateWindowDimensions, 100));
  }
  updateWindowDimensions() {
    this.setState({
      window: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    });
  }
  render() {
    return (
      <WindowContext.Provider value={this.state.window}>
        {this.props.children}
      </WindowContext.Provider>
    );
  }
}

WindowProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]).isRequired,
};

export {
  WindowContext,
  WindowProvider
};
