/**
 * Displays a progress bar, with a given stroke width and percentage completion.
 */

import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';

import './ProgressBar.css';

const MapControlSummaryProgressBar = ({ percentage, width, ...other }) => {
  // eslint-disable-next-line no-param-reassign
  if (percentage < 0) percentage = 0;

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
