/**
 * Perform translations in SSR.
 *
 * This file is to be ONLY LOADED BY THE SERVER.
 */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const NAMESPACES = ['core', 'map-ui', 'map-changelog', 'error', 'pages'];

export const getServerSideTranslations = async ({ locale }: { locale: string }): Promise<any> => ({
  props: {
    ...(await serverSideTranslations(locale, NAMESPACES)),
  },
});
