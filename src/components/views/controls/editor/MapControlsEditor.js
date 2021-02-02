/**
 * Provides the interface for the Editor tab in the Map controls.
 */

import { Button } from '@material-ui/core';
import _ from 'lodash';
import newGithubIssueUrl from 'new-github-issue-url';
import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import { generatePrettyJSON, openURLInWindow, setBrowserClipboard } from '~/components/Util';
import MapControlsEditorMarker from '~/components/views/controls/editor/MapControlsEditorMarker';
import MapControlsEditorRoute from '~/components/views/controls/editor/MapControlsEditorRoute';
import ClearEditorDataPopup from '~/components/views/popups/ClearEditorDataPopup';
import SubmitEditorDataPopup from '~/components/views/popups/SubmitEditorDataPopup';
import { clearEditorData } from '~/redux/ducks/editor';
import { setControlsTab } from '~/redux/ducks/ui';

import BorderBox from '~/components/interface/BorderBox';
import { TabView } from '~/components/interface/Tabs';

// Note: The dispatchers generated by mapDispatchToProps
// shadow their associated action generators.
/* eslint-disable no-shadow */
const _MapControlsEditor = ({ displayed, editorData, resetTab, clearEditorData }) => {
  const submitEditorData = async (formData) => {
    const dataObject = {
      ...formData,
      data: editorData.feature.data,
    };

    const jsonData = generatePrettyJSON(dataObject);

    const _result = await setBrowserClipboard(jsonData);

    const url = newGithubIssueUrl({
      user: 'genshinmap',
      repo: 'genshinmap.github.io',
      title: `[EDITOR] ${formData.name.en}`,
      labels: ['mapping'],
      body: `The following data was generated by this user using the Editor mode. Any required images should be uploaded to this issue by dragging and dropping.\n\`\`\`\nTHE EDITOR DATA SHOULD BE IN YOUR CLIPBOARD NOW. PASTE IT HERE.\n\`\`\``,
    });

    openURLInWindow(url);
  };

  return (
    <TabView displayed={displayed}>
      <BorderBox overflow="hidden auto">
        {editorData.feature.data.map((element, index) => {
          // If the first element is an array, rather than a coordinate,
          // we have a set of multiple points in a route.
          const isRoute = element?.coordinates && Array.isArray(element?.coordinates[0]);

          return isRoute ? (
            <MapControlsEditorRoute key={element?.id} index={index} route={element} />
          ) : (
            <MapControlsEditorMarker key={element?.id} index={index} marker={element} />
          );
        })}
      </BorderBox>
      <ClearEditorDataPopup
        trigger={
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            aria-label="Clear"
            tabIndex={0}
          >
            {t('map-editor-button-clear')}
          </Button>
        }
        onConfirm={() => {
          clearEditorData();
          resetTab();
        }}
      />

      <SubmitEditorDataPopup
        trigger={
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            aria-label="Clear"
            tabIndex={0}
          >
            {t('map-editor-button-submit')}
          </Button>
        }
        onConfirm={submitEditorData}
      />
    </TabView>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'elements',
  editorData: state.editor,
});
const mapDispatchToProps = (dispatch) => ({
  resetTab: () => dispatch(setControlsTab('features')),
  clearEditorData: () => dispatch(clearEditorData()),
});
const MapControlsEditor = connect(mapStateToProps, mapDispatchToProps)(_MapControlsEditor);

export default MapControlsEditor;
