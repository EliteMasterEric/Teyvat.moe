import { createGenerateClassName, ServerStyleSheets } from '@material-ui/styles';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
} from 'next/document';
import React, { Children } from 'react';
import PageHeaders from 'src/components/views/PageHeaders';

const generateClassName = createGenerateClassName({
  disableGlobal: false, // Disable generation of deterministic class names.
  productionPrefix: 'muicss', // The string used to prefix the class names in production.
  seed: 'archon', // String uniquely identifying the generator.
});

// Resolution order
//
// On the server:
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. document.getInitialProps
// 4. app.render
// 5. page.render
// 6. document.render
//
// On the server with error:
// 1. document.getInitialProps
// 2. app.render
// 3. page.render
// 4. document.render
//
// On the client
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. app.render
// 4. page.render

class _document extends Document {
  static async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets({
      // injectFirst: true,
      serverGenerateClassName: generateClassName,
    });
    const originalRenderPage = context.renderPage;

    context.renderPage = () =>
      originalRenderPage({
        // The method wraps your React node in a provider element.
        // It collects the style sheets during the rendering so they can be later sent to the client.
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    console.info(`Performing SSR for path ${context.pathname} (${context.locale})`);

    const initialProps = await Document.getInitialProps(context);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <PageHeaders />
        </Head>
        <body>
          {/* Main gets replaced with the actual page content. */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _document;
