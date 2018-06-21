import React from 'react';
import PropTypes from 'prop-types';
import './ScrollArea.scss';

const ScrollArea = ({ children, height }) => (
  <div className="scroll-area" style={{ height }}>
    {children}
  </div>
);

export default ScrollArea;

ScrollArea.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]).isRequired,
  height: PropTypes.number.isRequired
};
