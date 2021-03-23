/**
 * Rather than crashing the full page, this component will cause
 * only the Editor view to break, while still including an error reporter.
 */

import React from 'react';
import { ErrorHandlerComponent } from 'src/components/views/error/ErrorHandler';

/**
 * Rather than crashing the whole page, we can gracefully display a crash reporter for only part of it.
 *
 * @param {*} componentKey The localization key of the component that broke.
 */
const MapErrorHandler: ErrorHandlerComponent = ({ error: _error, errorInfo: _errorInfo }) => {
  // Note: react-error-overlay will display over this in development.
  // Press 'ESC' to hide it.

  return <>Error</>;
};

export default MapErrorHandler;
