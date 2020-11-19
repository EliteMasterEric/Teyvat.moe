import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import './MapControlsSummaryProgressBar.css';

const MapControlSummaryProgressBar = ({ percentage, width, ...other }) => {
  const endPos = (90 - 3) * percentage + 3;
  return (
    <svg viewBox={`0 0 100 ${width}`} {...other}>
      <path
        className={clsx('map-controls-about-summary-feature-progress-back')}
        d="M 3,6 L 90,6"
        strokeWidth="5"
        strokeLinecap="round"
        stroke="#D9D9D9"
        fillOpacity="0"
      />
      <path
        className={clsx('map-controls-about-summary-feature-progress-front')}
        d={`M 3,6 L ${endPos},6`}
        strokeWidth="5"
        strokeLinecap="round"
        stroke="#2db7f5"
        fillOpacity="0"
      />
    </svg>
  );
};

export default MapControlSummaryProgressBar;
