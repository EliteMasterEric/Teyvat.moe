import { CssBaseline } from '@material-ui/core';
import { ThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import React, { FunctionComponent } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { store } from 'src/components/redux';
import Theme from 'src/components/Theme';
import ErrorHandler from 'src/components/views/error/ErrorHandler';
import FullPageErrorHandler from 'src/components/views/error/FullPageErrorHandler';
import { NotificationProvider } from 'src/components/views/NotificationProvider';

const generateClassName = createGenerateClassName({
  disableGlobal: false, // Disable generation of deterministic class names.
  productionPrefix: 'muicss', // The string used to prefix the class names in production.
  seed: 'paimon', // String uniquely identifying the generator.
});

const _app: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  // TODO: Remove server-side JSS styles.
  // Normally you'd call 'useEffect' to call jssStyles.parentElement.removeChild(jssStyles);
  // However, I was experiencing an unknown bug where the old class names weren't being replaced
  // with the new ones, so I just got rid of the call so that the old class names would work.

  return (
    <>
      {/* StoreProvider allows hooks and components to access the Redux store. */}
      <StoreProvider store={store}>
        <StylesProvider generateClassName={generateClassName}>
          {/* ThemeProvider allows for child components to access the Material UI theme. */}
          <ThemeProvider theme={Theme}>
            {/* CSSBaseline injects a basic cascading style sheet for use by Material UI styling. */}
            <CssBaseline />
            {/* NotificationProvider handles the Notistack.
              Must be a child of StoreProvider since Redux handles notifications. */}
            <NotificationProvider>
              {/* ErrorHandler provides a fallback interface to use if the web page crashes. */}
              <ErrorHandler errorHandler={FullPageErrorHandler}>
                {/* Component provides the actual map content. */}
                <Component {...pageProps} />
              </ErrorHandler>
            </NotificationProvider>
          </ThemeProvider>
        </StylesProvider>
      </StoreProvider>
    </>
  );
};

export default appWithTranslation(_app);
