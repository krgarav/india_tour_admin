import React from 'react';
import './Placeholder.css';

const Placeholder = ({ width = '100%', height = '1em' }) => {
  return <div className="placeholder" style={{ width, height }}></div>;
};

export default Placeholder;
