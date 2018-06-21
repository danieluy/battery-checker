import React from 'react';
import PropTypes from 'prop-types';
import './Container.scss';

const Container = ({ children, fullWidth }) => (
  <div className={`container ${fullWidth ? 'fullWidth' : ''}`}>
    {children}
  </div>
);

export default Container;

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]).isRequired,
  fullWidth: PropTypes.bool
};
Container.defaultProps = {
  fullWidth: false
};
