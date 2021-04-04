/**
 * Provides an error handler which will either display a component or,
 * if the component throws an error, display an appropriate error handler.
 *
 * Any component, not just the main page component, can utilize this wrapper.
 * Utilizing this wrapper on an unstable component will replace it with the error handler,
 * while preventing the parent DOM from being dropped.
 */

import React, {
  createElement,
  Component,
  ReactNode,
  FunctionComponent,
  ErrorInfo,
  ComponentClass,
  ReactElement,
} from 'react';

export interface ErrorHandlerComponentProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
export type ErrorHandlerComponent = FunctionComponent<ErrorHandlerComponentProps>;

/**
 * Wraps the component in a error boundary, and renders the error handler component in the event of an error.
 *
 * Note that this MUST wrap one or more components. If the direct child of the error handler throws an error,
 * the error handler itself cannot render and the issue gets passed up to the parent.
 * @param {Component} children The components to render.
 * @param {Function<Component>} errorHandler If `component` crashes, create an instance of this type and render it instead.
 */
type ErrorHandlerProps = {
  children: ReactNode;
  errorHandler: ErrorHandlerComponent;
};
type ErrorHandlerState = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
};
class ErrorHandler extends Component<ErrorHandlerProps, ErrorHandlerState> {
  constructor(props: ErrorHandlerProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error /* , errorPartialInfo, state */): ErrorHandlerState {
    // Update state so the next render will show the fallback UI.
    // console.log(`Get derived state from error: ${errorPartialInfo}`);
    return { error, errorInfo: null };
  }

  /*
    The componentDidCatch Lifecycle Method is used to record
    the error which occurred. The componentDidCatch is not
    a factor in the rendering of the fallback error UI. In fact,
    this method will run after the re-rendering of the component
    to display the fallback UI
    If a componentDidCatch method is defined but the 
    getDerivedStateFromError method is not defined then an error
    will appear in the console stating that the getDerivedStateFromError
    should be defined.
    Here is the execution order:
    ** Task 1: JavaScript **
    - Error Boundary Component: Render
    - Error Thrown in Child Component
    - Error Boundary Component: getDerivedStateFromError
    - Error Boundary Component: Render to display Fallback UI
    - Error Boundary Component: componentDidCatch
    ** Task 2: Browser UI **
    - Paint
  */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Add side effects here.
    this.setState({
      error,
      errorInfo,
    });
  }

  render(): ReactElement {
    const { error, errorInfo } = this.state;
    const { children, errorHandler } = this.props;

    // If there is an error, display the error handler
    // instead of the base page.
    if (error) {
      console.error('Error caught, rendering error handler...');
      return createElement(errorHandler, { error, errorInfo });
    }

    // Else, render the child components.
    return <>{children}</>;
  }
}

export default ErrorHandler;

// eslint-disable-next-line @typescript-eslint/ban-types
type HandleErrorType = <P extends {}>(
  component: FunctionComponent<P> | ComponentClass<P>,
  errorHandler: ErrorHandlerComponent
) => FunctionComponent<P>;

export const handleError: HandleErrorType = (component, errorHandler) => (props) => {
  return <ErrorHandler errorHandler={errorHandler}>{createElement(component, props)}</ErrorHandler>;
};
