// eslint-disable-next-line no-restricted-imports
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const NAMESPACES = ['core', 'map-ui', 'map-changelog', 'error'];

export const getServerSideTranslations = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, NAMESPACES)),
  },
});
