/**
 * Utilizes the Bifrost library to transmit the local storage data
 * directly from the other domain.
 *
 * Works completely seamlessly on Google Chrome!
 * Requires additional interaction on Firefox. See this dumb bullshit:
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/Document/requestStorageAccess
 */

import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState, FunctionComponent, LegacyRef, ReactElement } from 'react';
import BifrostCors from 'packages/bifrost/bifrost';
import { LocalizedTypography, t } from 'src/components/i18n/Localization';
import { migrateMapData } from 'src/components/preferences/map/DataImport';
import { PREFERENCES_STORAGE_KEY } from 'src/components/preferences/map/ReduxStore';
import { store } from 'src/components/redux';
import { dispatchSetPreferences } from 'src/components/redux/slices/common/core/Dispatch';
import { sendNotification } from 'src/components/redux/slices/common/notify/Dispatch';
import { selectNamespaceMap } from 'src/components/redux/slices/map';

const useStyles = makeStyles((_theme) => ({
  label: {
    flexGrow: 1,
  },
  button: {
    width: 140,
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  portalIframe: {
    width: '100%',
    height: '100%',
  },
}));

const GENSHINMAP_MIGRATION_URL = 'https://genshinmap.github.io/migrate';
const GENSHINMAP_IFRAME_ID = 'bifrost-bridge-frame-genshinmap';

const initializeBifrost = async () => {
  const BifrostCORS = (await import('packages/bifrost/bifrost')).default;
  const bifrostClient = new BifrostCORS(GENSHINMAP_MIGRATION_URL, true, GENSHINMAP_IFRAME_ID);
  return bifrostClient;
};

const bifrostRequestStorage = async (
  bifrost: BifrostCors,
  onReceiveStorage: (data: string) => void
) => {
  const onSuccess = (data: string | null) => {
    if (data == null) {
      console.warn('[BIFROST] Bifrost returned no data. Is this correct?');
    } else {
      // console.info('[BIFROST] Successfully received local storage data. Running callback...');
      onReceiveStorage(data);
    }
  };
  const onFailure = (error: Error) => {
    console.warn('BIFROST FAILURE');
    console.warn(error);
  };

  // console.info('[BIFROST] Requesting data from local storage through Bifrost...');
  bifrost.getLocalStorage(PREFERENCES_STORAGE_KEY).then(onSuccess, onFailure);
};

const BifrostMigrator: FunctionComponent = () => {
  const classes = useStyles();

  const [bifrostPortal, setBifrostPortal] = useState<ReactElement | null>(null);

  const [_bifrostClient, setBifrostClient] = useState<BifrostCors | null>(null);

  const onPressMigrate = async () => {
    // console.info('[BIFROST-MIGRATOR] Injecting iframe for BifrostMigrator...');

    const iframeElement = document.createElement('iframe');
    iframeElement.src = GENSHINMAP_MIGRATION_URL;
    iframeElement.className = classes.portalIframe;
    iframeElement.id = GENSHINMAP_IFRAME_ID;
    iframeElement.referrerPolicy = 'origin'; // Include the origin URL.
    iframeElement.onload = () => {
      setTimeout(async () => {
        const bfClient = await initializeBifrost();
        setBifrostClient(bfClient);

        // console.info(
        //   '[BIFROST-MIGRATOR] Client object initialized after loading iframe. Requesting storage...'
        // );

        if (bfClient == null) {
          console.error('[BIFROST-MIGRATOR] Client was null.');
          return;
        }

        bifrostRequestStorage(bfClient, (data: string) => {
          let dataJson = null;
          try {
            dataJson = JSON.parse(data);
          } catch (error) {
            if (error instanceof SyntaxError) {
              console.error('[BIFROST-MIGRATOR] Failed to parse JSON response.');
            }
          }

          if (dataJson == null) {
            console.warn('[BIFROST-MIGRATOR] Could not retrieve Bifrost data.');
            sendNotification(t('message-import-error-generic'));
            return;
          }

          const migratedData = migrateMapData(dataJson, dataJson.version);
          dispatchSetPreferences({
            map: {
              ...selectNamespaceMap(store.getState()),
              ...migratedData,
            },
          });
        });
      }, 3000);
    };

    const refFunction: LegacyRef<HTMLDivElement> = (parentElement) => {
      parentElement && parentElement.appendChild(iframeElement);
    };
    setBifrostPortal(<div ref={refFunction} />);
  };

  return (
    <>
      {bifrostPortal != null ? (
        bifrostPortal
      ) : (
        <Box className={classes.optionContainer}>
          <LocalizedTypography className={classes.label} i18nKey="map-ui:migrate-genshinmap" />
          <Button
            className={classes.button}
            variant="contained"
            size="small"
            onClick={onPressMigrate}
          >
            {t('migrate')}
          </Button>
        </Box>
      )}
    </>
  );
};

export default BifrostMigrator;
